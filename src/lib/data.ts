export type RoomCategory = "Réunion" | "Conférence" | "Formation" | "Événement";
export type BookingStatus = "En attente" | "Confirmée" | "Refusée";

export interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  capacity: number;
  building: string;
  floor: string;
  roomNumber: string;
  image: string;
  gallery: string[];
  features: string[];
  description: string;
}

export interface Booking {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  subject: string;
  participants: number;
  status: BookingStatus;
  note?: string;
}

export const rooms: Room[] = [
  {
    id: "horizon",
    name: "Salle Horizon",
    category: "Réunion",
    capacity: 12,
    building: "Bâtiment A",
    floor: "1er étage",
    roomNumber: "A-104",
    image: "/rooms/horizon.jpg",
    gallery: ["/rooms/horizon-detail.jpg", "/rooms/horizon-side.jpg"],
    features: ["Wi-Fi haut débit", "Écran connecté", "Climatisation", "Tableau blanc"],
    description:
      "Un espace lumineux et calme pour vos réunions d’équipe, ateliers collaboratifs et échanges de projet. Table centrale et écran de présentation à votre disposition.",
  },
  {
    id: "agora",
    name: "Salle Agora",
    category: "Conférence",
    capacity: 80,
    building: "Bâtiment B",
    floor: "Rez-de-chaussée",
    roomNumber: "B-012",
    image: "/rooms/agora.jpg",
    gallery: ["/rooms/agora.jpg", "/rooms/agora.jpg"],
    features: ["Wi-Fi", "Vidéoprojecteur", "Sonorisation", "Microphone"],
    description:
      "Un auditorium spacieux et équipé pour vos présentations, conférences et événements d’établissement.",
  },
  {
    id: "atelier",
    name: "Salle Atelier",
    category: "Formation",
    capacity: 24,
    building: "Bâtiment A",
    floor: "2e étage",
    roomNumber: "A-208",
    image: "/rooms/atelier.jpg",
    gallery: ["/rooms/atelier.jpg", "/rooms/atelier.jpg"],
    features: ["Wi-Fi", "Tableau blanc", "Écran connecté", "Climatisation"],
    description:
      "Une salle modulable baignée de lumière naturelle, idéale pour les formations et les petits groupes de travail.",
  },
];

export const initialBookings: Booking[] = [
  {
    id: "SAL-2026-0142",
    roomId: "horizon",
    date: "2026-11-19",
    start: "09:00",
    end: "11:00",
    subject: "Réunion du projet de fin d’études",
    participants: 8,
    status: "En attente",
    note: "Présentation de notre avancement et préparation de la soutenance.",
  },
  {
    id: "SAL-2026-0128",
    roomId: "atelier",
    date: "2026-11-24",
    start: "14:00",
    end: "17:00",
    subject: "Atelier de préparation à la soutenance",
    participants: 20,
    status: "Confirmée",
  },
  {
    id: "SAL-2026-0110",
    roomId: "agora",
    date: "2026-11-10",
    start: "10:00",
    end: "12:00",
    subject: "Présentation des associations",
    participants: 50,
    status: "Refusée",
  },
];

export const categories: RoomCategory[] = ["Réunion", "Conférence", "Formation", "Événement"];
