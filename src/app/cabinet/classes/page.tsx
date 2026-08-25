import { ButtonLink } from "@/components/ButtonLink";
import { CancelBookingButton } from "@/components/CancelBookingButton";
import { StatusBadge } from "@/components/StatusBadge";
import { requireStudent } from "@/actions/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatDateNumeric, formatTime } from "@/lib/format";

export default async function CabinetClassesPage() {
  const user = await requireStudent();
  const bookings = await prisma.booking.findMany({ where: { userId: user.id } });

  const now = new Date();
  const upcoming = bookings
    .filter((b) => b.status === "BOOKED" && b.class.startsAt >= now)
    .sort((a, b) => a.class.startsAt.getTime() - b.class.startsAt.getTime());
  const history = bookings
    .filter((b) => b.status !== "BOOKED" || b.class.startsAt < now)
    .sort((a, b) => b.class.startsAt.getTime() - a.class.startsAt.getTime())
    .slice(0, 20);

  return (
    <div className="grid gap-5">
      <section className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="app-card-title">Предстоящие занятия</h2>
          <ButtonLink href="/schedule" size="sm" variant="secondary">
            Записаться ещё
          </ButtonLink>
        </div>

        {upcoming.length === 0 ? (
          <p className="card-body mt-5 text-sm">
            Активных записей нет. Выберите занятие в расписании.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {upcoming.map((booking) => (
              <li key={booking.id} className="flex flex-wrap items-center gap-4 py-4">
                <div className="w-40 shrink-0">
                  <p className="text-sm text-accent-300">{formatDate(booking.class.startsAt)}</p>
                  <p className="mt-1 text-xs text-muted-dim">
                    {formatTime(booking.class.startsAt)} — {formatTime(booking.class.endsAt)}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{booking.class.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {booking.class.teacher.user.name} · {booking.class.room} · {booking.class.level}
                  </p>
                </div>
                <CancelBookingButton bookingId={booking.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="app-card">
        <h2 className="app-card-title">История занятий</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="data-table min-w-[640px]">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Занятие</th>
                <th>Преподаватель</th>
                <th>Зал</th>
                <th className="text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">
                    История пока пуста.
                  </td>
                </tr>
              )}
              {history.map((booking) => (
                <tr key={booking.id}>
                  <td>{formatDateNumeric(booking.class.startsAt)}</td>
                  <td className="text-foreground">{booking.class.title}</td>
                  <td>{booking.class.teacher.user.name}</td>
                  <td>{booking.class.room}</td>
                  <td className="text-right">
                    <StatusBadge
                      status={
                        booking.status === "CANCELLED"
                          ? "CANCELLED"
                          : (booking.attendance?.status ?? "BOOKED")
                      }
                    />
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
