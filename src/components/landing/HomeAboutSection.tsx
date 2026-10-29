import { Heart, Music4, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/Container";

const highlights = [
  {
    value: "С нуля",
    suffix: "и дальше",
    text: "Есть группы для новичков и тех, кто уже танцует — подскажем, куда лучше зайти",
  },
  {
    value: "Бесплатно",
    suffix: "пробное",
    text: "Одно занятие без оплаты: посмотреть зал, преподавателя и понять, откликается ли формат",
  },
  {
    value: "Не только",
    suffix: "уроки",
    text: "Вечеринки, поездки и знакомства — танец живёт и вне расписания",
  },
] as const;

const values = [
  {
    icon: Heart,
    title: "Чувство важнее схемы",
    text: "Учим слышать музыку и партнёра. Шаги — инструмент, а не цель сама по себе.",
  },
  {
    icon: Users,
    title: "Небольшие группы",
    text: "Преподаватель успевает подойти, поправить и объяснить — вас не теряют в общем потоке.",
  },
  {
    icon: Music4,
    title: "Музыкальность",
    text: "Разбираем трек, акценты и паузы. Чтобы танцевать не «по счёту», а по ощущению.",
  },
  {
    icon: Sparkles,
    title: "Жизнь вне класса",
    text: "Вечеринки и практики Aliento — место, где закрепляется то, что разобрали на уроке.",
  },
] as const;

const steps = [
  {
    title: "Напишите нам",
    text: "В Telegram или Max — подскажем ближайшее пробное и какая группа подойдёт.",
  },
  {
    title: "Пробное занятие",
    text: "Бесплатно. Смотрите зал, преподавателя и атмосферу — без обязательств.",
  },
  {
    title: "Абонемент",
    text: "Это количество занятий, а не «одна фиксированная группа». Ходите в удобном ритме.",
  },
  {
    title: "Вечеринки и практика",
    text: "Когда база есть — выходите танцевать с теми, кого уже знаете по залу.",
  },
] as const;

export function HomeAboutSection() {
  return (
    <section id="about" className="bg-background py-14 md:py-20">
      <Container className="space-y-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">О нас</h2>
          <p className="prose-body mt-4">
            Aliento — место, где учат бачате и кизомбе без сухого «раз-два-три». Здесь можно начать с
            нуля, найти свою группу и постепенно выйти на вечеринки с людьми, которых уже знаешь по залу.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.text} className="app-card">
              <p className="font-display text-3xl text-accent-300">
                {item.value}
                <span className="ml-2 text-base text-muted">{item.suffix}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((item) => (
            <div key={item.title} className="app-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong bg-accent-500/12 text-accent-300">
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="app-card-title mt-5">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="app-card">
          <h3 className="font-display text-xl md:text-2xl">Как обычно начинается</h3>
          <ol className="mt-6 grid gap-5 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step.title} className="step-row">
                <span className="step-number">{index + 1}</span>
                <span>
                  <span className="block text-base text-foreground">{step.title}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
