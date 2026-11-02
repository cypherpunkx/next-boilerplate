"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Next.js Route Error Captured:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
        <AlertOctagon className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Terjadi Kesalahan Sistem
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Aplikasi mengalami kendala teknis saat memproses halaman ini. Error telah dicatat untuk penanganan lebih lanjut.
      </p>
      {error.digest && (
        <code className="mt-3 rounded bg-muted px-2 py-1 text-xs text-muted-foreground font-mono">
          Digest: {error.digest}
        </code>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>Muat Ulang Halaman</span>
        </Button>
      </div>
    </div>
  );
}
