import * as v from "valibot";
import { ApiError } from "@/types/api";

/**
 * Validasi runtime payload data API menggunakan Valibot schema
 */
export function validateApiResponse<TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: TSchema,
  data: unknown
): v.InferOutput<TSchema> {
  const result = v.safeParse(schema, data);

  if (!result.success) {
    const flattened = v.flatten(result.issues);
    const details = Object.entries(flattened.nested || {}).map(([field, messages]) => ({
      field,
      message: (messages as string[])?.join(", ") || "Invalid value",
    }));

    throw new ApiError("Validasi skema response API gagal", 422, details);
  }

  return result.output;
}
