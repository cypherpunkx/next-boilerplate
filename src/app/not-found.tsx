import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-primary/10 p-4 text-primary mb-4">
        <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: "12s" }} />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">Halaman Tidak Ditemukan</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau tautan yang Anda gunakan tidak valid.
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
