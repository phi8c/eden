import type { ReactNode } from "react";

import { ProtectedRoute } from "@/modules/auth/components/ProtectedRoute";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
