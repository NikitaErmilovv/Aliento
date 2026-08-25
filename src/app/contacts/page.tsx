import Link from "next/link";
import { Camera, Clock, Mail, MapPin, Phone, Send, Video } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ButtonLink";
import { CtaBanner } from "@/components/CtaBanner";
import { buildMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Контакты",
  description: "Контакты школы бачаты Aliento: адрес, телефон, часы работы и соцсети.",
  path: "/contacts",
});

export default async function ContactsPage() {
  const settings = await prisma.settings.get();

  const contacts = [
    { icon: Phone, label: "Телефон", value: settings.phone, href: `tel:${settings.phone.replace(/[^+\d]/g, "")}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Адрес", value: settings.address },
    { icon: Clock, label: "Часы работы", value: settings.hours },
  ];

  const socials = [
    { icon: Send, label: "Telegram", href: siteConfig.telegram.channel },
    { icon: Camera, label: "Instagram", href: siteConfig.social.instagram },
    { icon: Video, label: "YouTube", href: siteConfig.social.youtube },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Контакты"
        title="Как с нами связаться"
        description="Ответим на вопросы про уровни, расписание и абонементы — и поможем выбрать первое занятие."
      >
        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/register">Записаться на занятие</ButtonLink>
          <ButtonLink href={siteConfig.telegram.direct} variant="secondary">
            Написать в Telegram
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="bg-background-elevated py-12 md:py-16">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <div className="app-card">
              <h2 className="font-display text-xl md:text-2xl">Школа {settings.schoolName}</h2>
              <ul className="mt-6 space-y-5">
                {contacts.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-accent-500/12 text-accent-300">
                      <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="stat-label">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="mt-1.5 block text-base text-foreground link-underline">
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1.5 text-base text-foreground">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-border pt-6">
                <p className="stat-label">Соцсети</p>
                <div className="mt-4 flex gap-2.5">
                  {socials.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent-400 hover:text-accent-300"
                    >
                      <social.icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="app-card">
                <h2 className="app-card-title">Уже занимаетесь у нас?</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Записи, абонемент и история платежей — в личном кабинете.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/login" size="sm">
                    Войти в кабинет
                  </ButtonLink>
                  <ButtonLink href="/schedule" variant="secondary" size="sm">
                    Расписание
                  </ButtonLink>
                </div>
              </div>

              <div className="stage-light app-card flex min-h-[220px] flex-col justify-end">
                <p className="stat-label">Зал школы</p>
                <p className="mt-2 font-display text-xl text-foreground">{settings.address}</p>
                <p className="mt-2 text-sm text-muted">
                  Два зала, паркет, зона отдыха. Приходите за 10 минут до начала занятия.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Остались вопросы?"
        description="Напишите нам в Telegram — ответим и подскажем, с чего начать."
        primaryLabel="Написать в Telegram"
        primaryHref={siteConfig.telegram.direct}
        secondaryLabel="Абонементы"
        secondaryHref="/subscriptions"
      />
    </>
  );
}
