import Link from "next/link";
import { Search } from "lucide-react";
import { InviteCodesPanel } from "@/components/InviteCodesPanel";
import { StatusBadge } from "@/components/StatusBadge";
import { UpcomingBirthdaysPanel } from "@/components/UpcomingBirthdaysPanel";
import { requireStaff } from "@/actions/auth";
import { prisma } from "@/lib/db";
import { getUpcomingBirthdays, formatBirthdayFull } from "@/lib/birthdays";
import { syncBirthdayAdminNotifications } from "@/lib/birthday-alerts";
import { formatDate, formatRub, isAdmin } from "@/lib/format";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireStaff();
  const staffIsAdmin = isAdmin(user.role);

  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const all = await prisma.user.findMany({ where: { role: "STUDENT" } });
  const upcomingBirthdays = getUpcomingBirthdays(all);

  if (staffIsAdmin) {
    await syncBirthdayAdminNotifications();
  }

  const students = query
    ? all.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.phone.toLowerCase().includes(query)
      )
    : all;

  const inviteCodes = staffIsAdmin ? await prisma.inviteCode.findMany() : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl md:text-3xl">Ученики</h1>
        <p className="text-sm text-muted">Всего: {all.length}</p>
      </div>

      {staffIsAdmin && <InviteCodesPanel codes={inviteCodes} />}

      <UpcomingBirthdaysPanel birthdays={upcomingBirthdays} />

      <section className="app-card">
        <form className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="field-label" htmlFor="q">
              Поиск по имени, email или телефону
            </label>
            <input id="q" name="q" defaultValue={q ?? ""} className="field" placeholder="Анна" />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search className="h-4 w-4" />
            Найти
          </button>
          {query && (
            <Link href="/admin/students" className="btn btn-ghost">
              Сбросить
            </Link>
          )}
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Контакты</th>
                <th>Абонемент</th>
                <th>Остаток</th>
                {staffIsAdmin && <th>Оплачено</th>}
                <th className="text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={staffIsAdmin ? 6 : 5} className="text-muted">
                    Ничего не найдено.
                  </td>
                </tr>
              )}
              {students.map((student) => {
                const active = student.subscriptions.find((s) => s.status === "ACTIVE");
                const paid = student.payments
                  .filter((p) => p.status === "PAID")
                  .reduce((sum, p) => sum + p.amountRub, 0);
                return (
                  <tr key={student.id}>
                    <td>
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="text-foreground link-underline"
                      >
                        {student.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-dim">
                        с {formatDate(student.createdAt)}
                      </p>
                    </td>
                    <td>
                      <p>{student.phone}</p>
                      <p className="text-xs text-muted-dim">{student.email}</p>
                      {student.dateOfBirth && (
                        <p className="mt-1 text-xs text-muted-dim">
                          {formatBirthdayFull(student.dateOfBirth)}
                        </p>
                      )}
                    </td>
                    <td>{active ? active.plan.name : <span className="text-muted-dim">Нет</span>}</td>
                    <td>
                      {active ? `${active.remainingClasses} из ${active.totalClasses}` : "—"}
                    </td>
                    {staffIsAdmin && <td>{formatRub(paid)}</td>}
                    <td className="text-right">
                      <StatusBadge status={student.blocked ? "BLOCKED" : "ACTIVE"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
