import { describe, it, expect } from "vitest";
import * as v from "valibot";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { createUserSchema } from "@/features/users/schemas/user.schema";

describe("Valibot Schema Validations", () => {
  describe("loginSchema", () => {
    it("harus lolos validasi untuk email dan password yang valid", () => {
      const validData = {
        email: "test@domain.com",
        password: "securePassword123",
      };

      const result = v.safeParse(loginSchema, validData);
      expect(result.success).toBe(true);
    });

    it("harus gagal validasi jika email tidak berformat email", () => {
      const invalidData = {
        email: "bukan-email",
        password: "securePassword123",
      };

      const result = v.safeParse(loginSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("harus gagal validasi jika password kurang dari 6 karakter", () => {
      const invalidData = {
        email: "test@domain.com",
        password: "123",
      };

      const result = v.safeParse(loginSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("createUserSchema", () => {
    it("harus lolos jika nama, email, dan role sesuai spesifikasi", () => {
      const validUser = {
        name: "Jane Doe",
        email: "jane@enterprise.com",
        role: "admin",
      };

      const result = v.safeParse(createUserSchema, validUser);
      expect(result.success).toBe(true);
    });

    it("harus menolak jika role tidak ada dalam enum picklist", () => {
      const invalidUser = {
        name: "Jane Doe",
        email: "jane@enterprise.com",
        role: "superadmin_invalid",
      };

      const result = v.safeParse(createUserSchema, invalidUser);
      expect(result.success).toBe(false);
    });
  });
});
