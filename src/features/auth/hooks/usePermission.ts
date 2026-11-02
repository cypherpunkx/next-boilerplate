import { useAuthStore } from "@/stores/auth-store";
import { Permission, ROLE_PERMISSIONS, UserRole } from "@/types/auth";

/**
 * Hook untuk pengecekan hak akses (RBAC) pada level komponen/fitur
 */
export function usePermission() {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.role);
  };

  return {
    user,
    hasPermission,
    hasRole,
    role: user?.role,
  };
}
