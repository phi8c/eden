import { AuthPanel } from "@/modules/auth/components/AuthPanel";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthPanel
      title="Tao tai khoan"
      description="Dang ky nhanh de bat dau chat, tao topic va test realtime."
    >
      <RegisterForm />
    </AuthPanel>
  );
}
