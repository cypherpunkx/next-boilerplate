"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { loginSchema, LoginInput } from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, AlertCircle } from "lucide-react";

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: valibotResolver(loginSchema),
    defaultValues: {
      email: "admin@enterprise.com",
      password: "password123",
    },
  });

  const onSubmit = (values: LoginInput) => {
    login(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error.message || "Gagal masuk ke sistem."}</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email Perusahaan
        </label>
        <Input
          type="email"
          placeholder="nama@perusahaan.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Kata Sandi
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isPending}>
        Masuk ke Dashboard
      </Button>
    </form>
  );
}
