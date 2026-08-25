import { Heart, Music4, Sparkles, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { CtaBanner } from "@/components/CtaBanner";
import { buildMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/db";
import { marketFacts, productDefinition } from "@/lib/facts-data";

export const metadata = buildMetadata({
  title: "О школе",
  description: "Школа бачаты Aliento: подход к обучению, залы, преподаватели и атмосфера.",
  path: "/about",
});

const values = [
  {
    icon: Heart,
    title: "Танец изнутри",
    text: "Бачата про чувство, музыку и партнёра, а не про сухую схему шагов.",
  },
  {
    icon: Users,
    title: "Внимание к каждому",
    text: "Небольшие группы: преподаватель успевает подойти и поправить лично.",
  },
  {
    icon: Music4,
    title: "Музыкальность",
    text: "Учимся слышать структуру трека и играть с акцентами, а не считать «раз-два-три».",
  },
  {
    icon: Sparkles,
    title: "Практика вне класса",
    text: "Вечеринки и практики школы, чтобы танцевать не только на уроке.",
  },
];

const steps = [
  { title: "Пробное занятие", text: "Приходите в удобный день — подскажем уровень и покажем базу." },
  { title: "Абонемент", text: "Выбираете количество занятий и записываетесь из личного кабинета." },
  { title: "Регулярность", text: "Ходите 1–2 раза в неделю: тело запоминает, уверенность растёт." },
  { title: "Социальные танцы", text: "Через пару месяцев уже танцуете на вечеринках школы." },
];

export default async function AboutPage() {
  const [teachers, classes] = await Promise.all([
    prisma.teacher.findMany(),
    prisma.danceClass.findMany({ where: { startsAt: { gte: new Date() } } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="О школе"
        title="Школа бачаты Aliento"
        description={productDefinition}
      />

      <section className="bg-background-elevated py-12 md:py-16">
        <Container className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {marketFacts.map((fact) => (
              <div key={fact.detail} className="app-card">
                <p className="font-display text-3xl text-accent-300">
                  {fact.value}
                  <span className="ml-2 text-base text-muted">{fact.unit}</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{fact.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="app-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong bg-accent-500/12 text-accent-300">
                  <value.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="app-card-title mt-5">{value.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{value.text}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="app-card">
              <h2 className="font-display text-xl md:text-2xl">Как проходит обучение</h2>
              <ol className="mt-6 space-y-5">
                {steps.map((step, index) => (
                  <li key={step.title} className="step-row">
                    <span className="step-number">{index + 1}</span>
                    <span>
                      <span className="block text-base text-foreground">{step.title}</span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                        {step.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="app-card">
              <h2 className="font-display text-xl md:text-2xl">Школа в цифрах</h2>
              <ul className="panel-list mt-6">
                <li className="justify-between">
                  <span className="text-sm text-muted">Преподавателей</span>
                  <span className="font-display text-lg text-foreground">{teachers.length}</span>
                </li>
                <li className="justify-between">
                  <span className="text-sm text-muted">Занятий в расписании</span>
                  <span className="font-display text-lg text-foreground">{classes.length}</span>
                </li>
                <li className="justify-between">
                  <span className="text-sm text-muted">Залы</span>
                  <span className="font-display text-lg text-foreground">2</span>
                </li>
                <li className="justify-between">
                  <span className="text-sm text-muted">Направления</span>
                  <span className="text-sm text-accent-300">Sensual · Partnerwork · Styling</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner secondaryLabel="Преподаватели" secondaryHref="/teachers" />
    </>
  );
}
