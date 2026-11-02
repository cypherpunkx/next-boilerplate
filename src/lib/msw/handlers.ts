import { http, HttpResponse, delay } from "msw";
import { User } from "@/types/auth";

let mockUsers: User[] = [
  {
    id: "usr_1",
    name: "Ahmad Rizky (Admin)",
    email: "admin@enterprise.com",
    role: "admin",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "usr_2",
    name: "Siti Rahma (Manager)",
    email: "manager@enterprise.com",
    role: "manager",
    createdAt: "2026-02-10T09:30:00Z",
  },
  {
    id: "usr_3",
    name: "Budi Santoso (User)",
    email: "budi@enterprise.com",
    role: "user",
    createdAt: "2026-03-01T14:15:00Z",
  },
  {
    id: "usr_4",
    name: "Dewi Lestari (User)",
    email: "dewi@enterprise.com",
    role: "user",
    createdAt: "2026-03-05T11:20:00Z",
  },
];

export const handlers = [
  // 1. POST /api/v1/auth/login
  http.post("*/api/v1/auth/login", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body?.email || !body?.password) {
      return HttpResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const matchedUser = mockUsers.find((u) => u.email === body.email) || mockUsers[0];

    return HttpResponse.json({
      success: true,
      message: "Login berhasil.",
      data: {
        user: matchedUser,
        tokens: {
          accessToken: "mock_jwt_access_token_" + Date.now(),
          refreshToken: "mock_jwt_refresh_token_" + Date.now(),
        },
      },
    });
  }),

  // 2. POST /api/v1/auth/refresh
  http.post("*/api/v1/auth/refresh", async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      message: "Token berhasil diperbarui.",
      data: {
        accessToken: "mock_jwt_new_access_token_" + Date.now(),
      },
    });
  }),

  // 3. GET /api/v1/auth/me
  http.get("*/api/v1/auth/me", async () => {
    await delay(150);
    return HttpResponse.json({
      success: true,
      data: mockUsers[0],
    });
  }),

  // 4. GET /api/v1/users (with search & role filtering)
  http.get("*/api/v1/users", async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const role = url.searchParams.get("role") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    let filtered = [...mockUsers];

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    if (role && role !== "all") {
      filtered = filtered.filter((u) => u.role === role);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  }),

  // 5. POST /api/v1/users (Create User)
  http.post("*/api/v1/users", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<User>;

    if (!body?.name || !body?.email || !body?.role) {
      return HttpResponse.json(
        { success: false, message: "Nama, email, dan role wajib diisi." },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: "usr_" + (mockUsers.length + 1),
      name: body.name,
      email: body.email,
      role: body.role,
      createdAt: new Date().toISOString(),
    };

    mockUsers.unshift(newUser);

    return HttpResponse.json(
      {
        success: true,
        message: "User baru berhasil ditambahkan.",
        data: newUser,
      },
      { status: 201 }
    );
  }),

  // 6. DELETE /api/v1/users/:id
  http.delete("*/api/v1/users/:id", async ({ params }) => {
    await delay(200);
    const { id } = params;
    mockUsers = mockUsers.filter((u) => u.id !== id);

    return HttpResponse.json({
      success: true,
      message: "User berhasil dihapus.",
      data: { id },
    });
  }),
];
