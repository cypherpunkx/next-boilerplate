import { apiClient } from "@/lib/api/client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { User } from "@/types/auth";
import { CreateUserInput, UserFilterInput } from "../schemas/user.schema";

export const usersApi = {
  async getUsers(params?: UserFilterInput): Promise<PaginatedResponse<User>["data"]> {
    const response = await apiClient.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return response.data.data;
  },

  async createUser(payload: CreateUserInput): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>("/users", payload);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
