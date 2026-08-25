import { PageHeader } from "@/components/PageHeader";
import { BuyPlanButton } from "@/components/BuyPlanButton";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/ButtonLink";
import { CtaBanner } from "@/components/CtaBanner";
import { PricingCards } from "@/components/PricingCards";
import { buildMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const metadata = buildMetadata({
  title: "Абонементы",
  description:
    "Тарифы школы бачаты Aliento: разовое занятие, абонементы на 4 и 8 занятий. Цены в рублях.",
  path: "/subscriptions",
});

const included = [
  "Групповые занятия по расписанию",
  "Запись и отмена из личного кабинета",
  "Учёт посещений и остатка занятий",
  "Практики и открытые классы школы",
];

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();
  const plans = await prisma.plan.findMany();

  return (
    <>
      <PageHeader
        eyebrow="Абонементы"
        title="Выберите свой ритм"
        description="Оплата абонемента проходит онлайн через ЮKassa. После успешного платежа абонемент сразу появится в личном кабинете."
      />

      <section className="bg-background-elevated py-12 md:py-16">
        <Container>
          <PricingCards
            plans={plans}
            columns={3}
            renderAction={(plan) =>
              user ? (
                <BuyPlanButton planId={plan.id} />
              ) : (
                <ButtonLink href="/register" className="w-full">
                  Зарегистрироваться
                </ButtonLink>
              )
            }
          />

          <div className="app-card mt-8">
            <h2 className="app-card-title">Что входит в абонемент</h2>
            <ul className="panel-list mt-4">
              {included.map((item) => (
                <li key={item} className="card-body text-sm">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Не знаете, какой абонемент выбрать?"
        description="Начните с пробного занятия — подскажем уровень и подберём удобный тариф."
        primaryLabel="Записаться на пробное"
        secondaryLabel="Посмотреть расписание"
        secondaryHref="/schedule"
      />
    </>
  );
}
