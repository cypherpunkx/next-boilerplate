"use client";

import { useEffect, useState, ReactNode } from "react";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

interface MSWProviderProps {
  children: ReactNode;
}

let mswInitPromise: Promise<void> | null = null;

async function startMSW(): Promise<void> {
  if (typeof window === "undefined" || !env.NEXT_PUBLIC_ENABLE_MSW) {
    return;
  }

  if (mswInitPromise) {
    return mswInitPromise;
  }

  mswInitPromise = (async () => {
    try {
      const { worker } = await import("@/lib/msw/browser");
      // Cegah error re-start pada React StrictMode / Fast Refresh
      if (worker.readyState === 0 || worker.readyState === undefined) {
        await worker.start({
          quiet: true,
          onUnhandledFrame: "bypass",
        });
        logger.info("Mock Service Worker (MSW) diinisialisasi untuk development.");
      }
    } catch (error) {
      logger.error("Gagal menginisialisasi MSW:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  })();

  return mswInitPromise;
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [isReady, setIsReady] = useState(() => !env.NEXT_PUBLIC_ENABLE_MSW);

  useEffect(() => {
    if (!isReady) {
      startMSW().finally(() => {
        setIsReady(true);
      });
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Menyiapkan lingkungan pengembangan...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
