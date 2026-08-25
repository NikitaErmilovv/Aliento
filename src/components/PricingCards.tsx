import { ButtonLink } from "./ButtonLink";
import { formatClassCount, formatRub } from "@/lib/format";
import { getPlanTheme } from "@/lib/plan-themes";
import { cn } from "@/lib/cn";

export type PricingPlan = {
  id: string;
  name: string;
  priceRub: number;
  classCount: number;
  durationDays: number;
  popular: boolean;
  description: string;
};

export function PricingCards({
  plans,
  columns = 3,
  renderAction,
}: {
  plans: PricingPlan[];
  columns?: 1 | 3;
  renderAction?: (plan: PricingPlan) => React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-4", columns === 3 && "sm:grid-cols-3")}>
      {plans.map((plan) => {
        const theme = getPlanTheme(plan.classCount);

        return (
          <article
            key={plan.id}
            className={cn("app-card relative flex flex-col overflow-hidden")}
            style={{
              borderColor: `color-mix(in srgb, ${theme.glow} 38%, var(--border))`,
              background: `linear-gradient(165deg, color-mix(in srgb, ${theme.glow} 14%, var(--surface)) 0%, var(--surface) 55%)`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: theme.gradient }} aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-foreground">{plan.name}</h3>
              {plan.popular && <span className="badge badge-accent">Популярный</span>}
            </div>
            <p className="mt-3 font-display text-3xl" style={{ color: theme.glow }}>
              {formatRub(plan.priceRub)}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">{plan.description}</p>
            <p className="mt-2 text-xs text-muted-dim">
              {formatClassCount(plan.classCount)} · {plan.durationDays} дней
            </p>
            <div className="mt-5 flex items-center gap-2">
              {renderAction?.(plan) ?? (
                <ButtonLink
                  href="/subscriptions"
                  size="sm"
                  variant={plan.popular ? "primary" : "secondary"}
                >
                  Выбрать
                </ButtonLink>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
