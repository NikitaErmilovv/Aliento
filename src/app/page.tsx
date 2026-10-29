import Script from "next/script";
import { Benefits } from "@/components/Benefits";
import { HomeAboutSection } from "@/components/landing/HomeAboutSection";
import { HomeAnnouncementsSection } from "@/components/landing/HomeAnnouncementsSection";
import { HomeBookSection } from "@/components/landing/HomeBookSection";
import { HomeDirectionsSection } from "@/components/landing/HomeDirectionsSection";
import { HomeHallSection } from "@/components/landing/HomeHallSection";
import { HomePartiesSection } from "@/components/landing/HomePartiesSection";
import { HomePriceSection } from "@/components/landing/HomePriceSection";
import { HomeReviewsSection } from "@/components/landing/HomeReviewsSection";
import { HomeScheduleSection } from "@/components/landing/HomeScheduleSection";
import { buildMetadata } from "@/lib/metadata";
import { webPageJsonLd } from "@/lib/json-ld";
import { prisma } from "@/lib/db";
import type { PartyEventCardData } from "@/components/PartyEventCard";

export const metadata = buildMetadata({
  title: "Aliento — танцевальное пространство",
  description:
    "Бачата и кизомба в Новосибирске. Приходите на пробное — дальше расскажем про группы, абонементы и вечеринки.",
  path: "",
});

export default async function Home() {
  const [events, announcements] = await Promise.all([
    prisma.event.findMany(),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const partyCards: PartyEventCardData[] = events
    .filter((e): e is typeof e & { number: number } => e.number !== undefined)
    .map((event) => ({
      id: event.id,
      number: event.number,
      title: event.title,
      description: event.description,
      startsAt: event.startsAt,
      place: event.place,
      imageUrl: event.imageUrl,
    }));

  return (
    <>
      <Script
        id="ld-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Aliento — танцевальное пространство",
              description:
                "Бачата и кизомба в Новосибирске. Приходите на пробное — дальше расскажем про группы, абонементы и вечеринки.",
              path: "",
            })
          ),
        }}
      />

      <HomeBookSection />
      <HomeAboutSection />
      <HomeDirectionsSection />
      <HomeHallSection />
      <div id="benefits">
        <Benefits />
      </div>
      <HomePartiesSection events={partyCards} />
      <HomeAnnouncementsSection items={announcements} />
      <HomeScheduleSection />
      <HomePriceSection />
      <HomeReviewsSection />
    </>
  );
}
