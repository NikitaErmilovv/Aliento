import Link from "next/link";
import Script from "next/script";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { HomeSpotlight } from "@/components/HomeSpotlight";
import { FeatureRow } from "@/components/FeatureRow";
import { EventsSection } from "@/components/EventsSection";
import { PricingCards } from "@/components/PricingCards";
import { CtaBanner } from "@/components/CtaBanner";
import { Container } from "@/components/Container";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getFaqByCategory } from "@/lib/faq-data";
import { buildMetadata } from "@/lib/metadata";
import { faqJsonLd, webPageJsonLd } from "@/lib/json-ld";
import { productDefinition } from "@/lib/facts-data";
import { prisma } from "@/lib/db";

export const metadata = buildMetadata({
  title: "Aliento — школа бачаты",
  description:
    "Школа бачаты Aliento: расписание занятий, абонементы, преподаватели и запись на класс. Танец, который чувствуется сердцем.",
  path: "",
});

export default async function Home() {
  const previewFaq = getFaqByCategory("general").slice(0, 4);
  const [events, plans] = await Promise.all([
    prisma.event.findMany(),
    prisma.plan.findMany(),
  ]);

  const partyCards = events
    .filter((e): e is typeof e & { number: number } => e.number !== undefined)
    .map((event) => ({
      id: event.id,
      number: event.number,
      title: event.title,
      description: event.description,
      startsAt: event.startsAt,
      place: event.place,
      imageUrl: event.imageUrl,
    }))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  return (
    <>
      <Script
        id="ld-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Aliento — школа бачаты",
              description: productDefinition,
              path: "",
            })
          ),
        }}
      />
      <Script
        id="ld-faq-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(previewFaq)) }}
      />

      <Hero />
      <FeatureRow />
      <HomeSpotlight />
      <EventsSection events={partyCards} />

      <section className="bg-background-elevated py-14 md:py-20">
        <Container>
          <div className="app-card mx-auto max-w-3xl">
            <h2 className="font-display text-xl md:text-2xl">Стоимость занятий</h2>
            <div className="mt-6">
              <PricingCards plans={plans} columns={1} />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-2xl md:text-3xl">Частые вопросы</h2>
            <div className="mt-8">
              <FaqAccordion items={previewFaq} />
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-sm text-accent-300 link-underline"
              >
                Все вопросы и ответы
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner
        secondaryLabel="Расписание вечеринок"
        secondaryHref="/events"
      />
    </>
  );
}
