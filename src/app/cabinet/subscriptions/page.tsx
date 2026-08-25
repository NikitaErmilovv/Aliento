import { ButtonLink } from "@/components/ButtonLink";
import { PaymentReturnBanner } from "@/components/PaymentReturnBanner";
import { StatusBadge } from "@/components/StatusBadge";
import { requireStudent } from "@/actions/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatRub } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Suspense } from "react";

export default async function CabinetSubscriptionsPage() {
  const user = await requireStudent();
  const items = await prisma.subscription.findMany({ where: { userId: user.id } });
  const active = items.filter((s) => s.status === "ACTIVE");
  const past = items.filter((s) => s.status !== "ACTIVE");

  return (
    <div className="grid gap-5">
      <Suspense fallback={null}>
        <PaymentReturnBanner />
      </Suspense>
      <section className="app-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="app-card-title">Активные абонементы</h2>
          <ButtonLink href="/subscriptions" size="sm">
            Купить абонемент
          </ButtonLink>
        </div>

        {active.length === 0 ? (
          <p className="card-body mt-5 text-sm">Активных абонементов нет.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {active.map((sub) => {
              const ratio = Math.round((sub.remainingClasses / sub.totalClasses) * 100);
              return (
                <article
                  key={sub.id}
                  className={cn("rounded-2xl border border-border-strong bg-accent-500/[0.07] p-5")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{sub.plan.name}</p>
                      <p className="mt-1 text-xs text-muted">{formatRub(sub.plan.priceRub)}</p>
                    </div>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Осталось занятий</span>
                      <span className="text-foreground">
                        {sub.remainingClasses} из {sub.totalClasses}
                      </span>
                    </div>
                    <div className="progress-track mt-2.5">
                      <div className="progress-fill" style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted">
                    Действует до <span className="text-foreground">{formatDate(sub.expiresAt)}</span>
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="app-card">
        <h2 className="app-card-title">История абонементов</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="data-table min-w-[600px]">
            <thead>
              <tr>
                <th>Абонемент</th>
                <th>Занятий</th>
                <th>Куплен</th>
                <th>Действовал до</th>
                <th className="text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {past.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">
                    Прошлых абонементов нет.
                  </td>
                </tr>
              )}
              {past.map((sub) => (
                <tr key={sub.id}>
                  <td className="text-foreground">{sub.plan.name}</td>
                  <td>
                    {sub.totalClasses - sub.remainingClasses} из {sub.totalClasses}
                  </td>
                  <td>{formatDate(sub.createdAt)}</td>
                  <td>{formatDate(sub.expiresAt)}</td>
                  <td className="text-right">
                    <StatusBadge status={sub.status} />
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
