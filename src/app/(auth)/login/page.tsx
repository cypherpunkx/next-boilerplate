import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Masuk Sistem",
  description: "Otentikasi pengguna untuk mengakses platform.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Next.js Production-Ready Modular Boilerplate
          </p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Masuk ke Akun Anda</CardTitle>
            <CardDescription>
              Gunakan kredensial yang telah terdaftar untuk melanjutkan ke dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            <div className="mt-6 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground space-y-2 border border-border/50">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Info className="h-3.5 w-3.5 text-primary" />
                <span>Akun Simulasi (Mock API Aktif):</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc">
                <li>
                  <strong className="text-foreground">Admin:</strong> admin@enterprise.com
                </li>
                <li>
                  <strong className="text-foreground">Manager:</strong> manager@enterprise.com
                </li>
                <li>
                  <strong className="text-foreground">User:</strong> budi@enterprise.com
                </li>
              </ul>
              <p className="text-[11px] text-muted-foreground/80 italic">
                *Password apa saja (min 6 karakter), contoh: password123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
