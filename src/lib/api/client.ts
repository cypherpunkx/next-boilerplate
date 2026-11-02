import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { tokenStorage } from "./token-storage";
import { ApiError } from "@/types/api";
import { logger } from "@/lib/logger";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Mutex & Queue handling untuk refresh token concurrency
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Inject Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Mutex Refresh & Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (!originalRequest) {
      return Promise.reject(new ApiError(error.message, error.response?.status || 500));
    }

    // 1. Tangani 401 Unauthorized (Refresh Token Mutex)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        isRefreshing = false;
        return Promise.reject(new ApiError("Sesi telah berakhir, silakan login kembali.", 401));
      }

      try {
        const refreshResponse = await axios.post(`${env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = refreshResponse.data?.data?.accessToken || refreshResponse.data?.accessToken;
        tokenStorage.setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenStorage.clear();
        logger.warn("Gagal memperbarui token otentikasi. Mengarahkan ke halaman login.");
        return Promise.reject(new ApiError("Sesi otentikasi kedaluwarsa.", 401));
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Retry Logic untuk 5xx Server Error & Network Drop (Maksimal 2x)
    const status = error.response?.status;
    const isNetworkOr5xx = !status || (status >= 500 && status <= 504);

    if (isNetworkOr5xx && (originalRequest.method?.toLowerCase() === "get")) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const MAX_RETRIES = 2;

      if (originalRequest._retryCount <= MAX_RETRIES) {
        const delay = Math.pow(2, originalRequest._retryCount) * 500;
        logger.warn(`API request gagal (${status || "Network"}). Percobaan ulang ${originalRequest._retryCount}/${MAX_RETRIES} dalam ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        return apiClient(originalRequest);
      }
    }

    // Format error response
    const responseData = error.response?.data as { message?: string; details?: unknown } | undefined;
    const errorMessage = responseData?.message || error.message || "Terjadi kesalahan pada server.";
    const apiError = new ApiError(errorMessage, error.response?.status || 500, responseData?.details);

    logger.error(`API Error: ${apiError.statusCode} - ${apiError.message}`, {
      url: originalRequest.url,
      method: originalRequest.method,
    });

    return Promise.reject(apiError);
  }
);
