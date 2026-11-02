import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  Boxes,
  FileCheck2,
  Workflow,
  ArrowRight,
  Server,
  Activity,
  Code2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Arsitektur & Overview",
  description: "Dasar arsitektur template enterprise Next.js.",
};

const pillars = [
  {
    title: "Robustness",
    icon: ShieldCheck,
    color: "text-blue-500",
    description:
      "Runtime schema validation menggunakan Valibot, multi-tier Error Boundaries, and fail-fast environment variable validation.",
  },
  {
    title: "Scalability",
    icon: Zap,
    color: "text-amber-500",
    description:
      "Feature-Driven Architecture (Bulletproof React), Zustand uncoupled state, dan TanStack Query v5 cache management.",
  },
  {
    title: "Reliability",
    icon: Activity,
    color: "text-emerald-500",
    description:
      "Token refresh mutex queue yang mencegah race condition saat token kedaluwarsa, automatic backoff retry, dan structured logging.",
  },
  {
    title: "Interoperability",
    icon: Workflow,
    color: "text-purple-500",
    description:
      "Agnostic Axios client siap berintegrasi dengan backend REST/Microservices apa pun (Go, Java, Node, Python) + MSW untuk offline mocking.",
  },
  {
    title: "Maintainability",
    icon: FileCheck2,
    color: "text-cyan-500",
    description:
      "TypeScript strict mode, Vitest unit test suite, ESLint, Prettier, dan modul domain yang terisolasi dengan rapi.",
  },
  {
    title: "Portability",
    icon: Server,
    color: "text-rose-500",
    description:
      "Multi-stage Dockerfile dengan Next.js standalone output, zero-lockin Radix/Tailwind components, dan container image ringan (<150MB).",
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border border-primary/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              Enterprise Ready
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Next.js 16 + React 19 + Valibot
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Sistem Fondasi & Arsitektur Boilerplate
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Template ini dirancang oleh Principal Engineer untuk membangun aplikasi web berskala enterprise yang tangguh, modular, dan siap diproduksi tanpa refactoring berulang.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/users">
            <Button className="flex items-center gap-2 shadow-sm">
              <Boxes className="h-4 w-4" />
              <span>Coba Demo CRUD User</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Core Architectural Pillars */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <span>6 Pilar Arsitektur Terimplementasi</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Setiap pilar memiliki modul kode dan justifikasi teknis di dalam codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="hover:shadow-md transition-shadow border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Icon className={`h-5 w-5 ${pillar.color}`} />
                    </div>
                    <CardTitle className="text-base">{pillar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* System Status & Diagnostics Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span>Status Runtime & Konfigurasi Lingkungan</span>
          </CardTitle>
          <CardDescription>
            Validasi startup real-time yang menjamin dependensi dan mock layer bekerja optimal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="rounded-lg border border-border p-3 space-y-1">
              <span className="text-muted-foreground">Skema Validasi</span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Valibot v1 (Ultra-light)
              </p>
            </div>
            <div className="rounded-lg border border-border p-3 space-y-1">
              <span className="text-muted-foreground">Data Fetching & Cache</span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                TanStack Query v5
              </p>
            </div>
            <div className="rounded-lg border border-border p-3 space-y-1">
              <span className="text-muted-foreground">State Management</span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Zustand (Persisted)
              </p>
            </div>
            <div className="rounded-lg border border-border p-3 space-y-1">
              <span className="text-muted-foreground">Mock API (MSW)</span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Aktif (Browser Service Worker)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
