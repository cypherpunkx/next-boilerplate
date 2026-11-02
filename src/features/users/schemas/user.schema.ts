import * as v from "valibot";

export const createUserSchema = v.object({
  name: v.pipe(
    v.string("Nama wajib diisi."),
    v.nonEmpty("Nama tidak boleh kosong."),
    v.minLength(3, "Nama minimal 3 karakter.")
  ),
  email: v.pipe(
    v.string("Email wajib diisi."),
    v.nonEmpty("Email tidak boleh kosong."),
    v.email("Format email tidak valid.")
  ),
  role: v.picklist(["admin", "manager", "user"], "Pilih peran pengguna yang valid."),
});

export type CreateUserInput = v.InferOutput<typeof createUserSchema>;

export const userFilterSchema = v.object({
  search: v.optional(v.string()),
  role: v.optional(v.string()),
  page: v.optional(v.number()),
  limit: v.optional(v.number()),
});

export type UserFilterInput = v.InferInput<typeof userFilterSchema>;
