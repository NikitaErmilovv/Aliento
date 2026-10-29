import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { Avatar } from "@/components/Avatar";
import { CtaBanner } from "@/components/CtaBanner";
import { buildMetadata } from "@/lib/metadata";
import { publicTeachers } from "@/lib/teachers-public";

export const metadata = buildMetadata({
  title: "Преподаватели",
  description: "Преподаватели Aliento: Валентина Ситник, Кристина Алпатова, Иван Мазуренко, Роман Данилов.",
  path: "/teachers",
});

export default function TeachersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Команда"
        title="Преподаватели школы"
        description="Мы объясняем спокойно и по делу: сначала база и ощущение партнёра, потом стиль и импровизация."
      />

      <section className="bg-background-elevated py-12 md:py-16">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {publicTeachers.map((teacher) => (
              <article key={teacher.name} className="app-card flex flex-col">
                <div className="flex items-center gap-4">
                  <Avatar name={teacher.name} size="lg" />
                  <div className="min-w-0">
                    <h2 className="font-display text-lg text-foreground">{teacher.name}</h2>
                    <p className="mt-1.5 text-sm text-accent-300">Преподаватель Aliento</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Хотите заниматься индивидуально?"
        description="Напишите нам — подберём преподавателя и удобное время."
        primaryLabel="Записаться"
        secondaryLabel="Смотреть расписание"
        secondaryHref="/schedule"
      />
    </>
  );
}
