import { Suspense } from "react";

import { AuthPanel } from "@/modules/auth/components/AuthPanel";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthPanel
      title="Dang nhap"
      description="Tiep tuc vao khong gian chat cua ban."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthPanel>
  );
}
