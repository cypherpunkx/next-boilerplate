import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "@/types/auth";

describe("useAuthStore Zustand Store", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("harus menginisialisasi state awal dengan benar (unauthenticated)", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("harus memperbarui user dan status saat setAuth dipanggil", () => {
    const mockUser: User = {
      id: "usr_99",
      name: "Super Admin",
      email: "admin@enterprise.com",
      role: "admin",
    };

    useAuthStore.getState().setAuth(mockUser, "mock_token_123");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe("Super Admin");
    expect(state.user?.role).toBe("admin");
  });

  it("harus membersihkan state saat logout dipanggil", () => {
    const mockUser: User = {
      id: "usr_99",
      name: "Super Admin",
      email: "admin@enterprise.com",
      role: "admin",
    };

    useAuthStore.getState().setAuth(mockUser, "mock_token_123");
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
