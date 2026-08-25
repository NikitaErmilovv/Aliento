import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { ButtonLink } from "@/components/ButtonLink";
import { BookButton } from "@/components/BookButton";
import { StatusBadge } from "@/components/StatusBadge";
import { requireStudent } from "@/actions/auth";
import { prisma } from "@/lib/db";
import {
  formatDate,
  formatDateNumeric,
  formatMonthYear,
  formatTime,
} from "@/lib/format";

export default async function CabinetOverview({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; message?: string }>;
}) {
  const { verified, message } = await searchParams;
  const session = await requireStudent();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.id } });

  const attendances = await prisma.attendance.findMany({ where: { userId: user.id } });

  const visited = attendances.filter((a) => a.status === "PRESENT").length;
  const missed = attendances.filter((a) => a.status === "ABSENT").length;

  const styleCount = new Map<string, number>();
  for (const row of attendances) {
    if (row.status !== "PRESENT") continue;
    styleCount.set(row.class.title, (styleCount.get(row.class.title) ?? 0) + 1);
  }
  const favouriteStyle =
    [...styleCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Пока не определился";

  const activeSub = user.subscriptions.find((s) => s.status === "ACTIVE") ?? null;
  const remainingRatio = activeSub
    ? Math.round((activeSub.remainingClasses / activeSub.totalClasses) * 100)
    : 0;

  const now = new Date();
  const nextBooking = user.bookings
    .filter((b) => b.status === "BOOKED" && b.class.startsAt >= now)
    .sort((a, b) => a.class.startsAt.getTime() - b.class.startsAt.getTime())[0];

  const upcomingClass = !nextBooking
    ? (
        await prisma.danceClass.findMany({
          where: { startsAt: { gte: now } },
          include: { bookings: { where: { status: "BOOKED" } } },
          take: 1,
        })
      )[0]
    : null;

  const recentAttendance = attendances.slice(0, 5);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {verified === "1" && (
        <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success lg:col-span-2">
          Email подтверждён — добро пожаловать в личный кабинет!
        </p>
      )}
      {message && (
        <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success lg:col-span-2">
          {message}
        </p>
      )}
      <section className="app-card">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div className="min-w-0">
            <h2 className="font-display text-xl text-foreground">{user.name}</h2>
            <p className="mt-1.5 truncate text-sm text-muted">{user.email}</p>
            <p className="text-sm text-muted">{user.phone}</p>
          </div>
        </div>
        <div className="mt-6">
          <ButtonLink href="/cabinet/profile" size="sm">
            Редактировать профиль
          </ButtonLink>
        </div>
      </section>

      <section className="app-card">
        <ul className="panel-list">
          <li className="justify-between">
            <span className="text-sm text-muted">Посещено занятий</span>
            <span className="font-display text-base text-foreground">{visited}</span>
          </li>
          <li className="justify-between">
            <span className="text-sm text-muted">Пропущено занятий</span>
            <span className="font-display text-base text-foreground">{missed}</span>
          </li>
          <li className="justify-between">
            <span className="text-sm text-muted">Любимый стиль</span>
            <span className="text-sm text-accent-300">{favouriteStyle}</span>
          </li>
          <li className="justify-between">
            <span className="text-sm text-muted">С нами</span>
            <span className="text-sm text-foreground">{formatMonthYear(user.createdAt)}</span>
          </li>
        </ul>
      </section>

      <section className="app-card">
        <h2 className="app-card-title">Мои абонементы</h2>
        {activeSub ? (
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{activeSub.plan.name}</p>
              <StatusBadge status="ACTIVE" />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Осталось занятий</span>
                <span className="text-foreground">
                  {activeSub.remainingClasses} из {activeSub.totalClasses}
                </span>
              </div>
              <div className="progress-track mt-2.5">
                <div className="progress-fill" style={{ width: `${remainingRatio}%` }} />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted">Действует до</span>
              <span className="text-foreground">{formatDate(activeSub.expiresAt)}</span>
            </div>
            <div className="mt-6">
              <ButtonLink href="/subscriptions" variant="secondary" size="sm">
                Купить абонемент
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <p className="card-body text-sm">
              Активного абонемента нет. Купите абонемент, чтобы записываться на занятия.
            </p>
            <div className="mt-5">
              <ButtonLink href="/subscriptions" size="sm">
                Выбрать абонемент
              </ButtonLink>
            </div>
          </div>
        )}
      </section>

      <section className="app-card">
        <h2 className="app-card-title">Посетить следующее занятие</h2>
        {nextBooking ? (
          <div className="mt-5">
            <p className="text-sm text-accent-300">
              {formatDate(nextBooking.class.startsAt)} · {formatTime(nextBooking.class.startsAt)} —{" "}
              {formatTime(nextBooking.class.endsAt)}
            </p>
            <p className="mt-3 font-display text-lg text-foreground">{nextBooking.class.title}</p>
            <p className="mt-1.5 text-sm text-muted">
              {nextBooking.class.room} · {nextBooking.class.teacher.user.name}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <StatusBadge status="BOOKED" label="Вы записаны" />
              <Link href="/cabinet/classes" className="text-sm text-accent-300 link-underline">
                Мои записи
              </Link>
            </div>
          </div>
        ) : upcomingClass ? (
          <div className="mt-5">
            <p className="text-sm text-accent-300">
              {formatDate(upcomingClass.startsAt)} · {formatTime(upcomingClass.startsAt)} —{" "}
              {formatTime(upcomingClass.endsAt)}
            </p>
            <p className="mt-3 font-display text-lg text-foreground">{upcomingClass.title}</p>
            <p className="mt-1.5 text-sm text-muted">
              {upcomingClass.room} · {upcomingClass.teacher.user.name}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <BookButton classId={upcomingClass.id} />
              <Link href="/schedule" className="text-sm text-accent-300 link-underline">
                Всё расписание
              </Link>
            </div>
          </div>
        ) : (
          <p className="card-body mt-5 text-sm">Ближайших занятий пока нет.</p>
        )}
      </section>

      <section className="app-card lg:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="app-card-title">Мои последние занятия</h2>
          <Link href="/cabinet/classes" className="text-sm text-accent-300 link-underline">
            Все занятия
          </Link>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="data-table min-w-[540px]">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Занятие</th>
                <th>Зал</th>
                <th className="text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted">
                    Посещений пока нет.
                  </td>
                </tr>
              )}
              {recentAttendance.map((row) => (
                <tr key={row.id}>
                  <td>{formatDateNumeric(row.class.startsAt)}</td>
                  <td className="text-foreground">{row.class.title}</td>
                  <td>{row.class.room}</td>
                  <td className="text-right">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
