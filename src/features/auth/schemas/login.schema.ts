import * as v from "valibot";

export const loginSchema = v.object({
  email: v.pipe(
    v.string("Email wajib berupa teks."),
    v.nonEmpty("Email wajib diisi."),
    v.email("Format alamat email tidak valid.")
  ),
  password: v.pipe(
    v.string("Password wajib diisi."),
    v.nonEmpty("Password wajib diisi."),
    v.minLength(6, "Password minimal 6 karakter.")
  ),
});

export type LoginInput = v.InferOutput<typeof loginSchema>;
