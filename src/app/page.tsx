import Script from "next/script";
import { Benefits } from "@/components/Benefits";
import { HomeAboutSection } from "@/components/landing/HomeAboutSection";
import { HomeAnnouncementsSection } from "@/components/landing/HomeAnnouncementsSection";
import { HomeBookSection } from "@/components/landing/HomeBookSection";
import { HomeDirectionsSection } from "@/components/landing/HomeDirectionsSection";
import { HomeHallSection } from "@/components/landing/HomeHallSection";
import { HomePartiesSection } from "@/components/landing/HomePartiesSection";
import { HomePriceSection } from "@/components/landing/HomePriceSection";
import { HomeLocationSection } from "@/components/landing/HomeLocationSection";
import { HomeReviewsSection } from "@/components/landing/HomeReviewsSection";
import { HomeScheduleSection } from "@/components/landing/HomeScheduleSection";
import { buildMetadata } from "@/lib/metadata";
import { webPageJsonLd } from "@/lib/json-ld";
import { prisma } from "@/lib/db";
import type { PartyEventCardData } from "@/components/PartyEventCard";
import { catalogToEventItems } from "@/lib/party-events";

export const metadata = buildMetadata({
  title: "Aliento — танцевальное пространство",
  description:
    "Бачата и кизомба в Новосибирске. Приходите на пробное — дальше расскажем про группы, абонементы и вечеринки.",
  path: "",
});

export default async function Home() {
  const [announcements, settings] = await Promise.all([
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.settings.get(),
  ]);

  const partyCards: PartyEventCardData[] = catalogToEventItems().map((event) => ({
    id: event.id,
    number: event.number,
    title: event.title,
    description: event.description,
    startsAt: new Date(event.startsAt),
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
      <HomeLocationSection hours={settings.hours} />
    </>
  );
}
