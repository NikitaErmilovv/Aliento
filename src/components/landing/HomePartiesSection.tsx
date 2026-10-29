"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { PartyEventCard, type PartyEventCardData } from "@/components/PartyEventCard";
import { STUDIO_VENUE_LABEL } from "@/lib/messengers";

export function HomePartiesSection({ events }: { events: PartyEventCardData[] }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...events].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const visible = showAll ? sorted : sorted.slice(0, 3);

  return (
    <section id="parties" className="bg-background py-14 md:py-20">
      <Container>
        <div>
          <h2 className="font-display text-2xl md:text-3xl">Вечеринки</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Тематические party сезона: своя атмосфера, dress-code и место встретиться вне урока.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <PartyEventCard
              key={event.id}
              event={{ ...event, place: STUDIO_VENUE_LABEL }}
              interactivePhotos
              className="h-full"
            />
          ))}
        </div>

        {sorted.length > 3 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="btn btn-secondary"
            >
              {showAll ? "Свернуть" : "Все вечеринки"}
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
