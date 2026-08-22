import Link from "next/link";
import {
  ArrowRight,
  Bell,
  LockKeyhole,
  MapPinned,
  MessageCircle,
  Navigation,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Topic chat gon gang",
    description:
      "Moi conversation co nhieu topic de tach luong noi dung, tranh troi tin nhan.",
    icon: MessageCircle,
  },
  {
    title: "Realtime tu dau",
    description:
      "Socket duoc to chuc thanh channel rieng cho message, friendship va map sau nay.",
    icon: Bell,
  },
  {
    title: "Map story san sang",
    description:
      "Chia se vi tri, moment va huong di duoc chua san trong trai nghiem chat.",
    icon: MapPinned,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#fff8f1] text-[var(--dove-text-dark)]">
      <section className="relative min-h-dvh">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,119,87,.20),transparent_34%),radial-gradient(circle_at_80%_8%,rgba(150,141,223,.20),transparent_30%),linear-gradient(180deg,#fff8f1_0%,#fdf3e7_58%,#fff_100%)]" />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-5 sm:px-6 lg:px-8">
          <header className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-2xl bg-[var(--dove-primary)] text-white shadow-sm">
                <Sparkles className="size-4" />
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--dove-primary)]">
                Eden
              </span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--dove-text-gray)] sm:flex">
              <a href="#features" className="hover:text-[var(--dove-primary)]">
                Tinh nang
              </a>
              <Link href="/login" className="hover:text-[var(--dove-primary)]">
                Dang nhap
              </Link>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-8">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--dove-primary)] shadow-sm ring-1 ring-[#f1ddcf]">
                <Navigation className="size-3.5" />
                Chat realtime va map story
              </p>
              <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-tight text-[#2f2926] sm:text-6xl lg:text-7xl">
                Eden
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#6f625c] sm:text-lg">
                Mot khong gian chat am ap, gon gang va san sang cho nhung
                khoanh khac tren ban do. Bat dau bang tin nhan, mo rong dan
                sang vi tri, moment va realtime presence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--dove-primary)] px-6 text-sm font-bold text-white shadow-lg shadow-[#d97757]/20 transition hover:translate-y-[-1px] hover:bg-[#c96747]"
                >
                  Bat dau voi Eden
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-bold text-[var(--dove-primary)] shadow-sm ring-1 ring-[#f1ddcf] transition hover:bg-[#fff3ea]"
                >
                  Dang nhap
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[440px]">
              <div className="absolute -inset-4 rounded-[34px] bg-[#d97757]/10 blur-2xl" />
              <div className="relative rounded-[30px] bg-[#fffdfb] p-4 shadow-2xl shadow-[#8f5e48]/15 ring-1 ring-[#f1ddcf]">
                <div className="rounded-[24px] bg-[#fdf3e7] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#2f2926]">
                        Minh Anh
                      </p>
                      <p className="text-xs text-[#9a8176]">
                        Dang online tren Eden
                      </p>
                    </div>
                    <span className="grid size-10 place-items-center rounded-full bg-white text-[var(--dove-primary)] shadow-sm">
                      <MapPinned className="size-5" />
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="max-w-[78%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-6 text-[#5f504a] shadow-sm">
                      Chieu nay minh gap o quan quen nhe?
                    </div>
                    <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[var(--dove-primary)] px-4 py-3 text-sm leading-6 text-white shadow-sm">
                      Oke, gui vi tri tren map cho minh.
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-3xl bg-white p-3 shadow-sm">
                    <div className="relative h-44 rounded-2xl bg-[#e8efe7]">
                      <div className="absolute inset-x-6 top-8 h-1 rounded-full bg-[#c7dcc9]" />
                      <div className="absolute bottom-8 left-8 right-4 h-1 rounded-full bg-[#d9c3b8]" />
                      <div className="absolute left-20 top-4 h-36 w-1 rounded-full bg-[#c7dcc9]" />
                      <div className="absolute right-20 top-8 h-28 w-1 rounded-full bg-[#d9c3b8]" />
                      <span className="absolute left-16 top-16 grid size-9 place-items-center rounded-full bg-[var(--dove-primary)] text-white shadow-lg ring-4 ring-white">
                        A
                      </span>
                      <span className="absolute bottom-10 right-14 grid size-9 place-items-center rounded-full bg-[var(--dove-avatar-text)] text-white shadow-lg ring-4 ring-white">
                        B
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#f1ddcf]"
          >
            <feature.icon className="size-5 text-[var(--dove-primary)]" />
            <h2 className="mt-4 text-base font-bold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#7d6a61]">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[30px] bg-[#2f2926] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#ffd7c7]">
              San sang vao chat?
            </p>
            <p className="mt-1 text-sm text-white/70">
              Dang nhap hoac tao tai khoan de tiep tuc voi Eden.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-[#2f2926]"
          >
            Tiep tuc
            <LockKeyhole className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
