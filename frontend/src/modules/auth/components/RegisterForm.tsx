"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await registerMutation.mutateAsync({
        username,
        email,
        password,
      });

      await loginMutation.mutateAsync({
        email,
        password,
      });
    } catch {
      return;
    }

    router.replace("/chat");
  }

  const isPending = registerMutation.isPending || loginMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="username">Ten hien thi</Label>
        <Input
          id="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          maxLength={50}
          required
        />
      </div>

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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          maxLength={100}
          required
        />
      </div>

      {(registerMutation.isError || loginMutation.isError) && (
        <p className="text-sm text-destructive">
          Dang ky khong thanh cong. Email hoac ten tai khoan co the da ton tai.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        <UserPlus data-icon="inline-start" />
        Tao tai khoan
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Da co tai khoan?{" "}
        <Link className="font-medium text-foreground underline" href="/login">
          Dang nhap
        </Link>
      </p>
    </form>
  );
}
