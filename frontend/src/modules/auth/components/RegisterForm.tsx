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
        <Label htmlFor="username" className="text-sm font-semibold text-[#4f403a]">
          Ten hien thi
        </Label>
        <Input
          id="username"
          autoComplete="username"
          placeholder="Eden friend"
          className="h-12 rounded-2xl border-[#f1ddcf] bg-[#fffaf6] px-4"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          maxLength={50}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm font-semibold text-[#4f403a]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ban@example.com"
          className="h-12 rounded-2xl border-[#f1ddcf] bg-[#fffaf6] px-4"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password" className="text-sm font-semibold text-[#4f403a]">
          Mat khau
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Toi thieu 6 ky tu"
          className="h-12 rounded-2xl border-[#f1ddcf] bg-[#fffaf6] px-4"
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

      <Button
        type="submit"
        className="mt-2 h-12 w-full rounded-2xl bg-[var(--dove-primary)] font-bold text-white shadow-lg shadow-[#d97757]/20 hover:bg-[#c96747]"
        disabled={isPending}
      >
        <UserPlus data-icon="inline-start" />
        Tao tai khoan
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Da co tai khoan?{" "}
        <Link
          className="font-bold text-[var(--dove-primary)] underline-offset-4 hover:underline"
          href="/login"
        >
          Dang nhap
        </Link>
      </p>
    </form>
  );
}
