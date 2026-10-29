import Image from "next/image";
import { Send } from "lucide-react";
import { Container } from "@/components/Container";
import { MessengerButtons } from "@/components/landing/MessengerButtons";
import { maxShareUrl, telegramUrl } from "@/lib/messengers";

export function HomeBookSection() {
  const tg = telegramUrl();

  return (
    <section id="book" className="bg-background pb-10 pt-6 md:pb-16 md:pt-10">
      <Container className="space-y-8">
        <div className="stage-light relative overflow-hidden rounded-3xl border border-border px-6 py-14 sm:px-10 sm:py-20 md:px-14 md:py-28">
          <Image
            src="/images/community/altai-7.jpg"
            alt=""
            fill
            priority
            className="pointer-events-none object-cover object-[center_40%] opacity-[0.28]"
            sizes="100vw"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35"
          />
          <div className="relative z-10 max-w-xl">
            <p className="label-caps">Запись</p>
            <h1 className="glow-text mt-5 font-display text-[clamp(2.75rem,11vw,6rem)] font-normal leading-[0.95] tracking-[0.06em] text-foreground">
              ALIENTO
            </h1>
            <p className="mt-5 max-w-md font-display text-xl leading-snug text-foreground/85 sm:text-2xl">
              Танец, который чувствуется сердцем
            </p>
            <p className="prose-body mt-5 max-w-lg text-[0.98rem] leading-relaxed sm:text-base">
              Бачата и кизомба в Новосибирске. Приходите на пробное — дальше расскажем про группы,
              абонементы и вечеринки. Напишите нам в Telegram или Max, ответим сами.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MessengerButtons size="md" className="!flex-row" />
            </div>
          </div>
        </div>

        <div className="content-panel text-center">
          <h2 className="font-display text-2xl">Напишите нам</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Подскажем группу под ваш уровень, время и как устроен абонемент. Можно сразу спросить про
            пробное — оно бесплатное. Отсканируйте QR или откройте мессенджер:
          </p>
          <div className="mt-8 flex items-start justify-center gap-8">
            <a
              href={tg}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(tg)}`}
                alt="QR-код Telegram"
                width={120}
                height={120}
                className="rounded-lg bg-white p-1.5"
              />
              <span className="text-xs text-muted">Telegram</span>
            </a>
            <div className="flex flex-col items-center gap-2">
              <a
                href={maxShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[120px] w-[120px] items-center justify-center rounded-lg border border-border bg-surface-2 p-3 text-center text-[11px] leading-snug text-muted transition-colors hover:border-accent-400 hover:text-foreground"
              >
                Открыть Max
              </a>
              <span className="text-xs text-muted">Max</span>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <MessengerButtons />
          </div>
        </div>
      </Container>
    </section>
  );
}
