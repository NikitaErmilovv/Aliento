import Script from "next/script";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BookButton } from "@/components/BookButton";
import { CtaBanner } from "@/components/CtaBanner";
import { Container } from "@/components/Container";
import { ScheduleTabs } from "@/components/ScheduleTabs";
import { ButtonLink } from "@/components/ButtonLink";
import { HallGridSection } from "@/components/HallHallsClient";
import { HallLegend } from "@/components/HallLegend";
import { HallWeekNav } from "@/components/HallWeekNav";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { prisma } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/format";
import { buildScheduleDays } from "@/lib/schedule";
import { loadHallGrid } from "@/lib/hall-grids";
import { isoDate, startOfWeek } from "@/lib/hall-grid";
import { getCurrentUser } from "@/lib/session";

export const metadata = buildMetadata({
  title: "Расписание",
  description:
    "Расписание школы бачаты Aliento: занятость зала по дням, занятия по дням недели и запись на класс.",
  path: "/schedule",
});

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const user = await getCurrentUser();
  const { week } = await searchParams;
  const weekStart = week ? new Date(`${week}T12:00:00`) : startOfWeek(new Date());
  const weekStartIso = isoDate(weekStart);

  const classes = await prisma.danceClass.findMany({
    where: { startsAt: { gte: new Date() } },
    include: {
      teacher: { include: { user: true } },
      bookings: { where: { status: "BOOKED" } },
    },
  });
  const days = buildScheduleDays(classes);
  const hallGrid = await loadHallGrid(weekStart, { hidePeopleCount: true });

  return (
    <>
      <Script
        id="ld-breadcrumb-schedule"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Главная", path: "/" },
              { name: "Расписание", path: "/schedule" },
            ])
          ),
        }}
      />

      <PageHeader
        eyebrow="Расписание"
        title="Занятость зала и занятия"
        description="Сверху — календарь зала по дням: когда идут занятия школы, когда зал сдан, когда свободен. Ниже — привычное расписание классов и запись."
      >
        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/subscriptions">Купить абонемент</ButtonLink>
          <ButtonLink href="/teachers" variant="secondary">
            Преподаватели
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="bg-background-elevated py-12 md:py-16">
        <Container className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <HallLegend activityTypes={hallGrid.activityTypes} />
              <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded-lg bg-surface-2" />}>
                <HallWeekNav weekStartIso={weekStartIso} basePath="/schedule" />
              </Suspense>
            </div>

            <HallGridSection
              grid={hallGrid}
              canManage={false}
              weekStartIso={weekStartIso}
              focusDateIso={isoDate(new Date())}
            />

            <p className="text-sm text-muted">
              Пустые ячейки — время, когда зал можно снять.{" "}
              <Link href="/contacts" className="text-accent-300 link-underline">
                Написать нам
                <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>

          <div className="app-card">
            <h2 className="font-display text-xl md:text-2xl">Занятия по дням недели</h2>
            <p className="mt-2 text-sm text-muted">Постоянная сетка классов — выберите день и запишитесь.</p>
            <div className="mt-6">
              <ScheduleTabs days={days} />
            </div>
          </div>

          <div className="app-card">
            <h2 className="font-display text-xl md:text-2xl">Ближайшие занятия</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="data-table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Время</th>
                    <th>Занятие</th>
                    <th>Уровень</th>
                    <th>Мест</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {classes.map((item) => {
                    const taken = item.bookings.length;
                    const already = user ? item.bookings.some((b) => b.userId === user.id) : false;
                    return (
                      <tr key={item.id}>
                        <td>{formatDate(item.startsAt)}</td>
                        <td className="text-accent-300">{formatTime(item.startsAt)}</td>
                        <td>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-dim">{item.teacher.user.name}</p>
                        </td>
                        <td>{item.level}</td>
                        <td>
                          {taken}/{item.capacity}
                        </td>
                        <td>
                          {!user ? (
                            <a href="/login" className="text-sm text-accent-300 link-underline">
                              Войти для записи
                            </a>
                          ) : (
                            <BookButton
                              classId={item.id}
                              disabledReason={
                                already
                                  ? "Вы уже записаны"
                                  : taken >= item.capacity
                                    ? "Мест нет"
                                    : undefined
                              }
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
