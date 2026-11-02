import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import { LoginResponseData, User } from "@/types/auth";
import { LoginInput } from "../schemas/login.schema";

export const authApi = {
  async login(payload: LoginInput): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>("/auth/login", payload);
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignored: cleanup client session anyway
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
};
