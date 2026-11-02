"use client";

import React, { ReactNode } from "react";
import { Permission, UserRole } from "@/types/auth";
import { usePermission } from "../hooks/usePermission";

interface CanProps {
  permission?: Permission;
  role?: UserRole | UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Komponen Otorisasi RBAC Declarative
 * 
 * @example
 * <Can permission="users:delete" fallback={<p>Akses ditolak</p>}>
 *   <Button variant="destructive">Hapus User</Button>
 * </Can>
 */
export function Can({ permission, role, fallback = null, children }: CanProps) {
  const { hasPermission, hasRole } = usePermission();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
