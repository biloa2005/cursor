"use client";

import Image from "next/image";
import { ArrowRight, Check, Users } from "lucide-react";
import type { Room } from "@/lib/data";

interface RoomCardProps {
  room: Room;
  compact?: boolean;
  priority?: boolean;
  onSelect: (room: Room) => void;
}

export function RoomCard({ room, compact = false, priority = false, onSelect }: RoomCardProps) {
  return (
    <article className={`room-card${compact ? " room-card--compact" : ""}`}>
      <button
        className="room-card__image-button"
        onClick={() => onSelect(room)}
        aria-label={`Découvrir ${room.name}`}
      >
        <Image
          src={room.image}
          alt={`Intérieur de ${room.name}`}
          fill
          priority={priority}
          sizes={compact ? "(max-width: 700px) 90vw, 360px" : "(max-width: 700px) 100vw, 520px"}
          className="room-card__image"
        />
      </button>
      <div className="room-card__body">
        <div className="room-card__heading">
          <h3>{room.name}</h3>
          <span className="status status--available">
            <Check size={15} strokeWidth={2.2} />
            Disponible
          </span>
        </div>
        <p className="room-card__meta">
          <Users size={17} />
          {room.capacity} personnes · {room.category}
        </p>
        <p className="room-card__features">{room.features.slice(0, 3).join(" · ")}</p>
        <button className="text-link" onClick={() => onSelect(room)}>
          Voir les détails <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}
