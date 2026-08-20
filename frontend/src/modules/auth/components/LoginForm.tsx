"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await loginMutation.mutateAsync({
        email,
        password,
      });
    } catch {
      return;
    }

    router.replace(searchParams.get("next") ?? "/chat");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Mat khau</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {loginMutation.isError && (
        <p className="text-sm text-destructive">
          Dang nhap khong thanh cong. Kiem tra email va mat khau.
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        <LogIn data-icon="inline-start" />
        Dang nhap
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Chua co tai khoan?{" "}
        <Link className="font-medium text-foreground underline" href="/register">
          Dang ky
        </Link>
      </p>
    </form>
  );
}
