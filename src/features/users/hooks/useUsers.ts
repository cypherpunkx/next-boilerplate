"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users-api";
import { CreateUserInput, UserFilterInput } from "../schemas/user.schema";

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  list: (filters?: UserFilterInput) => ["users", "list", filters] as const,
};

export function useUsers(filters?: UserFilterInput) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(filters),
    queryFn: () => usersApi.getUsers(filters),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserInput) => usersApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
}
