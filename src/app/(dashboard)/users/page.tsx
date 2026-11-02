"use client";

import React, { useState } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { UserFilterBar } from "@/features/users/components/UserFilterBar";
import { UserTable } from "@/features/users/components/UserTable";
import { CreateUserDialog } from "@/features/users/components/CreateUserDialog";
import { Can } from "@/features/auth/components/Can";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Info } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const { data, isLoading } = useUsers({
    search,
    role,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Manajemen Pengguna</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Contoh implementasi end-to-end: TanStack Query v5 + Valibot Resolver + RBAC Permissions.
          </p>
        </div>

        {/* Create User Button protected by RBAC */}
        <Can permission="users:write">
          <CreateUserDialog />
        </Can>
      </div>

      {/* RBAC Info Notice */}
      <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4 border border-border text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Role-Based Access Control (RBAC) Aktif:
          </p>
          <p>
            - <strong>Admin:</strong> Memiliki akses penuh (Bisa membuat dan menghapus pengguna).
            <br />
            - <strong>Manager:</strong> Hanya bisa melihat dan membuat pengguna baru (Tombol Hapus disembunyikan oleh komponen <code>&lt;Can /&gt;</code>).
            <br />
            - <strong>User:</strong> Hanya bisa melihat data pengguna (Tombol Tambah dan Hapus tidak tersedia).
          </p>
        </div>
      </div>

      {/* Filter and Table Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Daftar Pengguna Aktif</CardTitle>
          <CardDescription>
            Pencarian dan filter dieksekusi secara reaktif melalui TanStack Query cache.
          </CardDescription>
          <div className="pt-2">
            <UserFilterBar
              search={search}
              onSearchChange={setSearch}
              role={role}
              onRoleChange={setRole}
            />
          </div>
        </CardHeader>
        <CardContent>
          <UserTable users={data?.items} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
