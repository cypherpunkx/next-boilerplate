import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("harus merender teks tombol dengan benar", () => {
    render(<Button>Simpan Data</Button>);
    expect(screen.getByRole("button", { name: /simpan data/i })).toBeInTheDocument();
  });

  it("harus berada dalam kondisi disabled saat isLoading bernilai true", () => {
    render(<Button isLoading>Memproses</Button>);
    const button = screen.getByRole("button", { name: /memproses/i });
    expect(button).toBeDisabled();
  });
});
