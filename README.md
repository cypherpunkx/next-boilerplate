# Next.js Enterprise Production-Ready Boilerplate

Template frontend modern berbasis **Next.js 16 (App Router)**, **React 19**, **Valibot**, **TanStack Query v5**, **Zustand**, dan **Tailwind CSS v4** yang dirancang dengan standar arsitektur tingkat Principal Engineer untuk membangun aplikasi skala menengah hingga enterprise (SaaS, Dashboard, Internal Tools, Web Portals).

---

## 🏛️ 6 Pilar Arsitektur Terimplementasi

| Pilar | Penerapan dalam Template |
| :--- | :--- |
| **🛡️ Robustness** | **Valibot Runtime Validation** untuk environment variable (`src/config/env.ts`) dan form payload. Multi-tier **Error Boundaries** (Global, Route, Component) untuk mengisolasi kegagalan runtime. |
| **📈 Scalability** | **Feature-Driven Architecture** (Bulletproof React pattern). Logika domain bisnis terisolasi dalam folder `src/features/*`, didukung oleh server state caching dari **TanStack Query v5** dan client state ringan dari **Zustand**. |
| **⚡ Reliability** | **Token Refresh Mutex Queue** pada HTTP client (`src/lib/api/client.ts`) yang mencegah race-condition saat multiple request mengalami token expired bersamaan. Exponential backoff retry otomatis pada network drops atau 5xx status. |
| **🔗 Interoperability** | **Agnostic HTTP Client** yang siap berkomunikasi dengan backend microservices apa pun (Go, Java Spring, Node.js, Python FastAPI, Supabase). Disertai **MSW (Mock Service Worker)** untuk isolasi pengujian dan development offline. |
| **🛠️ Maintainability** | TypeScript Strict Mode, **Vitest** unit testing suite, **React Testing Library**, ESLint, dan Prettier dengan automated CI quality gates. |
| **🐳 Portability** | **Multi-stage Dockerfile** menggunakan fitur Next.js `standalone` output menghasilkan container image ultra-ringan (<150MB), siap dideploy ke Kubernetes, Cloud Run, AWS ECS, Coolify, maupun VPS. |

---

## 📂 Struktur Proyek (Feature-Driven Architecture)

```text
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI (lint, typecheck, test, build)
├── Dockerfile                   # Multi-stage optimized production container
├── public/
│   └── mockServiceWorker.js     # MSW service worker untuk browser mocking
├── src/
│   ├── app/                     # Next.js App Router (Routing, Layouts, Pages)
│   │   ├── (auth)/login/        # Halaman autentikasi login
│   │   ├── (dashboard)/         # Layout dashboard terproteksi & navigasi
│   │   │   ├── page.tsx         # Dashboard overview
│   │   │   └── users/page.tsx   # Demo fitur User Management (CRUD + RBAC)
│   │   ├── error.tsx            # Error boundary halaman
│   │   ├── global-error.tsx     # Root error boundary
│   │   ├── not-found.tsx        # Halaman 404
│   │   └── layout.tsx           # Root provider wrapper
│   ├── components/
│   │   ├── feedback/            # ErrorBoundary, EmptyState, LoadingSpinner
│   │   └── ui/                  # Shadcn primitives (Button, Input, Card, Table, Dialog, Badge, Skeleton)
│   ├── config/
│   │   ├── env.ts               # Type-safe Environment Validation (Valibot)
│   │   └── site.ts              # App metadata & navigation constants
│   ├── features/                # Domain Modules (Feature-Sliced)
│   │   ├── auth/                # Auth domain: components, hooks, api, schemas, RBAC
│   │   └── users/               # Users CRUD domain: api, hooks, schemas, components
│   ├── lib/
│   │   ├── api/                 # Axios client, token-storage, mutex interceptors
│   │   ├── logger/              # Structured logger abstraction (Sentry ready)
│   │   ├── msw/                 # Mock Service Worker handlers & browser setup
│   │   └── utils.ts             # Tailwind merge (cn) & data formatters
│   ├── providers/               # AppProviders, QueryProvider, MSWProvider
│   ├── proxy.ts                 # Next.js Edge Route Protection (Proxy / Middleware)
│   ├── stores/                  # Zustand global client stores (auth-store, ui-store)
│   └── types/                   # Cross-cutting TypeScript interfaces (ApiResponse, Auth, RBAC)
├── tests/                       # Test setup, utilities & unit tests
│   ├── unit/                    # Vitest test suites
│   ├── setup.ts
│   └── test-utils.tsx
├── package.json
└── vitest.config.ts
```

---

## 🚀 Memulai (Quick Start)

### 1. Prasyarat
- **Node.js**: v22+
- **pnpm**: v10+

### 2. Instalasi Dependensi
```bash
pnpm install
```

### 3. Salin Konfigurasi Environment
```bash
cp .env.example .env.local
```

### 4. Jalankan Development Server
```bash
pnpm dev
```
Akses aplikasi di browser pada: [http://localhost:3000](http://localhost:3000).

> **Catatan Mock API (MSW):**
> Secara default, `NEXT_PUBLIC_ENABLE_MSW=true` diaktifkan di `.env.local`. Anda dapat login langsung menggunakan salah satu akun demo berikut:
> - **Admin (Akses Penuh):** `admin@enterprise.com`
> - **Manager (Read & Write):** `manager@enterprise.com`
> - **User (Read Only):** `budi@enterprise.com`
> - Password: apa saja (minimal 6 karakter, contoh: `password123`)

---

## 🔒 Autentikasi & Role-Based Access Control (RBAC)

### 1. Komponen Otorisasi `<Can />`
Sembunyikan atau render elemen UI secara deklaratif berdasarkan peran atau permission pengguna:

```tsx
import { Can } from "@/features/auth/components/Can";
import { Button } from "@/components/ui/button";

// Berdasarkan granular permission
<Can permission="users:delete" fallback={<p>Akses ditolak</p>}>
  <Button variant="destructive">Hapus Data</Button>
</Can>

// Berdasarkan role tertentu
<Can role={["admin", "manager"]}>
  <Button>Export Laporan</Button>
</Can>
```

### 2. Edge Middleware Route Guard (`src/proxy.ts`)
Semua rute dilindungi di edge runtime sebelum halaman di-render:
- Pengguna yang belum login otomatis diarahkan ke `/login?callbackUrl=...`
- Pengguna yang sudah login yang membuka `/login` otomatis dialihkan ke `/`

---

## 📝 Panduan Menambah Fitur Baru (Step-by-Step)

Untuk menambahkan domain bisnis baru (misalnya fitur `products`), ikuti konvensi feature-driven berikut:

1. **Buat folder fitur**: `src/features/products/`
2. **Definisikan skema validasi**: `src/features/products/schemas/product.schema.ts`
   ```ts
   import * as v from "valibot";
   export const createProductSchema = v.object({
     name: v.pipe(v.string(), v.nonEmpty("Nama wajib diisi")),
     price: v.pipe(v.number(), v.minValue(0, "Harga minimal 0")),
   });
   export type CreateProductInput = v.InferOutput<typeof createProductSchema>;
   ```
3. **Definisikan API service**: `src/features/products/api/products-api.ts`
   ```ts
   import { apiClient } from "@/lib/api/client";
   export const productsApi = {
     getProducts: () => apiClient.get("/products").then(res => res.data.data),
     createProduct: (data) => apiClient.post("/products", data).then(res => res.data.data),
   };
   ```
4. **Buat React Query Hooks**: `src/features/products/hooks/useProducts.ts`
   ```ts
   import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
   export function useProducts() {
     return useQuery({ queryKey: ["products"], queryFn: productsApi.getProducts });
   }
   ```
5. **Buat UI Komponen**: `src/features/products/components/ProductList.tsx`
6. **Ekspos Halaman**: `src/app/(dashboard)/products/page.tsx`

---

## 🧪 Pengujian & Quality Gates

```bash
# Menjalankan pengujian unit (Vitest)
pnpm test

# Menjalankan pengujian dalam mode watch
pnpm test:watch

# Memeriksa TypeScript type safety tanpa emit
pnpm typecheck

# Memeriksa standar kode linter
pnpm lint

# Format kode otomatis
pnpm format
```

---

## 🐳 Deployment Container (Docker)

Build dan jalankan container production:

```bash
# Build image
docker build -t next-enterprise-boilerplate:latest .

# Jalankan container
docker run -p 3000:3000 --env-file .env.local next-enterprise-boilerplate:latest
```
Akses container pada [http://localhost:3000](http://localhost:3000). Image berukuran sangat kecil (<150MB) dan berjalan di bawah akun non-root `nextjs` untuk kepatuhan standar keamanan container.
