"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-bold">Terjadi Kesalahan Sistem</h2>
        <p className="mt-2 text-sm text-gray-500">
          Aplikasi mengalami kendala teknis tak terduga.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Muat Ulang
        </button>
      </body>
    </html>
  );
}
