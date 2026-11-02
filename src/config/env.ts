import * as v from "valibot";

/**
 * Schema Environment Variable Server & Client menggunakan Valibot
 */
const envSchema = v.object({
  NODE_ENV: v.fallback(
    v.picklist(["development", "test", "production"]),
    "development"
  ),
  NEXT_PUBLIC_APP_NAME: v.fallback(v.string(), "Next Modular Boilerplate"),
  NEXT_PUBLIC_API_BASE_URL: v.fallback(
    v.pipe(v.string(), v.url()),
    "https://api.example.com/v1"
  ),
  NEXT_PUBLIC_ENABLE_MSW: v.fallback(
    v.pipe(
      v.string(),
      v.transform((val) => val === "true" || val === "1")
    ),
    false
  ),
  NEXT_PUBLIC_APP_URL: v.fallback(
    v.pipe(v.string(), v.url()),
    "http://localhost:3000"
  ),
});

export type Env = v.InferOutput<typeof envSchema>;

function validateEnv(): Env {
  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_ENABLE_MSW: process.env.NEXT_PUBLIC_ENABLE_MSW,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  const result = v.safeParse(envSchema, rawEnv);

  if (!result.success) {
    console.error("❌ Kesalahan konfigurasi Environment Variables:", v.flatten(result.issues).nested);
    throw new Error("Invalid environment variables");
  }

  return result.output;
}

export const env = validateEnv();
