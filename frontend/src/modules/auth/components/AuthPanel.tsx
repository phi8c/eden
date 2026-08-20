import type { ReactNode } from "react";

interface AuthPanelProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthPanel({
  title,
  description,
  children,
}: AuthPanelProps) {
  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1fr_480px]">
      <section className="relative hidden overflow-hidden border-r bg-zinc-950 text-white lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#111827_0%,#171717_48%,#12312f_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-teal-200">
              Dove Chat
            </p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-tight">
              Tro chuyen nhanh, don gian, san sang cho realtime map.
            </h1>
          </div>
          <p className="max-w-lg text-sm leading-6 text-zinc-300">
            Nen NextJS moi tach ro auth, chat, socket va map de minh phat
            trien lau dai ma khong lam roi codebase.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-sm font-medium text-muted-foreground">
              Dove Chat
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
