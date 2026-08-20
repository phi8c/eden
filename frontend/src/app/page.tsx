import Link from "next/link";
import { ArrowRight, MapPinned, MessageCircle, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background">
      <section className="relative flex min-h-[92dvh] items-center overflow-hidden border-b bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#111827_0%,#18181b_46%,#0f3d3e_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-teal-200">
              Dove Chat
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Dove Chat
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              Mot khong gian chat realtime gon, nhanh, va san sang mo rong
              sang chia se vi tri tren ban do.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Bat dau
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Dang nhap
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/8 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-md bg-zinc-950/80 p-4">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-sm font-medium">General</p>
                  <p className="text-xs text-zinc-400">2 nguoi dang online</p>
                </div>
                <MapPinned className="size-5 text-teal-200" />
              </div>
              <div className="space-y-3">
                <div className="max-w-[78%] rounded-lg bg-white/10 px-3 py-2 text-sm">
                  Hello, realtime da san sang.
                </div>
                <div className="ml-auto max-w-[78%] rounded-lg bg-teal-300 px-3 py-2 text-sm text-zinc-950">
                  Minh se test chat truoc, map sau.
                </div>
                <div className="grid h-44 place-items-center rounded-lg border border-white/10 bg-[linear-gradient(135deg,#164e63,#27272a)] text-sm text-zinc-200">
                  Chat map preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-8 md:grid-cols-3">
        {[
          ["Chat truoc", "Dang nhap, tao hoi thoai, gui va nhan tin nhan."],
          ["Socket rieng", "Realtime duoc dong goi de sau nay them channel moi."],
          ["Map san sang", "Kien truc chua cho location sharing giua 2 nguoi."],
        ].map(([title, description], index) => {
          const Icon = [MessageCircle, ShieldCheck, MapPinned][index];

          return (
            <article key={title} className="rounded-lg border p-4">
              <Icon className="size-5 text-teal-700" />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
