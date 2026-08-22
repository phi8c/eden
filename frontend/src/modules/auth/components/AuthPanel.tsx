import Link from "next/link";
import type { ReactNode } from "react";
import { MapPinned, MessageCircle, Sparkles } from "lucide-react";

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
    <main className="grid min-h-dvh bg-[#fff8f1] text-[var(--dove-text-dark)] lg:grid-cols-[minmax(0,1fr)_500px]">
      <section className="relative hidden overflow-hidden bg-[#2f2926] text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,119,87,.35),transparent_36%),radial-gradient(circle_at_80%_8%,rgba(150,141,223,.24),transparent_30%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--dove-primary)] text-white">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.24em] text-[#ffd7c7]">
              Eden
            </span>
          </Link>

          <div className="max-w-xl">
            <p className="inline-flex rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd7c7]">
              Realtime chat space
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight">
              Tro chuyen nhe nhang, ket noi ro rang hon.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">
              Eden gom chat, topic va map story vao mot trai nghiem gon gang
              de ban tiep tuc xay dung cac tinh nang realtime sau nay.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/10 p-4 backdrop-blur">
            <div className="rounded-[22px] bg-white p-4 text-[#2f2926]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Topic: Weekend</p>
                  <p className="text-xs text-[#8f7d75]">2 nguoi dang online</p>
                </div>
                <span className="grid size-9 place-items-center rounded-full bg-[#fdf3e7] text-[var(--dove-primary)]">
                  <MapPinned className="size-4" />
                </span>
              </div>
              <div className="space-y-3">
                <div className="max-w-[76%] rounded-2xl rounded-tl-md bg-[#fdf3e7] px-4 py-3 text-sm">
                  Minh vua toi gan diem hen.
                </div>
                <div className="ml-auto max-w-[76%] rounded-2xl rounded-tr-md bg-[var(--dove-primary)] px-4 py-3 text-sm text-white">
                  Gui moment tren map cho minh nhe.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-5 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(217,119,87,.16),transparent_30%),linear-gradient(180deg,#fff8f1_0%,#fdf3e7_100%)] lg:hidden" />
        <div className="relative w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-2xl bg-[var(--dove-primary)] text-white shadow-sm">
                <Sparkles className="size-4" />
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--dove-primary)]">
                Eden
              </span>
            </Link>
            <MessageCircle className="size-5 text-[var(--dove-primary)]" />
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-xl shadow-[#8f5e48]/10 ring-1 ring-[#f1ddcf] sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--dove-primary)]">
                Welcome to Eden
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#7d6a61]">
                {description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
