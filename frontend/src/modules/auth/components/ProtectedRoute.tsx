"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "../stores/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  useEffect(() => {
    if (!isBootstrapping && !accessToken) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, isBootstrapping, pathname, router]);

  if (isBootstrapping || !accessToken) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Dang kiem tra phien dang nhap
        </div>
      </div>
    );
  }

  return children;
}
