"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Grid2X2,
  House,
  LockKeyhole,
  MapPin,
  Pencil,
  Search,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  UserRound,
  Users,
  Wifi,
  X,
  Monitor,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { RoomCard } from "@/components/room-card";
import { Booking, BookingStatus, categories, initialBookings, Room, rooms } from "@/lib/data";

type Screen =
  | "home"
  | "explore"
  | "room"
  | "availability"
  | "request"
  | "success"
  | "reservations"
  | "profile"
  | "edit-profile"
  | "filters"
  | "gallery"
  | "login"
  | "signup"
  | "recovery"
  | "admin";

type MainTab = "home" | "explore" | "reservations" | "profile";
type ReservationFilter = "Toutes" | BookingStatus;

const slots = ["09:00", "11:00", "14:00", "16:00"];
const slotLabels = ["09:00 – 11:00", "11:00 – 13:00", "14:00 – 16:00", "16:00 – 18:00"];
const equipmentOptions = ["Wi-Fi", "Vidéoprojecteur", "Climatisation", "Tableau"];
const profileImage = "/rooms/camille.jpg";

function readBookings(): Booking[] {
  try {
    const stored = window.localStorage.getItem("salib-bookings");
    if (!stored) return initialBookings;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Format de réservations invalide.");
    return parsed as Booking[];
  } catch (error) {
    console.error("Impossible de charger les réservations enregistrées.", error);
    return initialBookings;
  }
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("fr-FR", options ?? { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(new Date(`${date}T12:00:00`))
    .replace(/^./, (letter) => letter.toLocaleUpperCase("fr-FR"));
}

function roomFor(booking: Booking) {
  return rooms.find((room) => room.id === booking.roomId) ?? rooms[0];
}

export function BookingApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<ReservationFilter>("Toutes");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minimumCapacity, setMinimumCapacity] = useState(0);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState(19);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [subject, setSubject] = useState("Réunion du projet de fin d’études");
  const [participants, setParticipants] = useState(8);
  const [note, setNote] = useState("Présentation de notre avancement et préparation de la soutenance.");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({ firstName: "Camille", lastName: "Martin", email: "camille.martin@salib.fr", phone: "06 12 34 56 78" });

  useEffect(() => {
    // Browser storage is only available after the server-rendered page hydrates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookings(readBookings());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("salib-bookings", JSON.stringify(bookings));
  }, [bookings, ready]);

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const matchesQuery = `${room.name} ${room.category} ${room.building}`.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = !category || room.category === category;
        const matchesCapacity = room.capacity >= minimumCapacity;
        const matchesEquipment = equipment.every((item) =>
          room.features.some((feature) => feature.toLowerCase().includes(item.toLowerCase().replace("tableau", "tableau"))),
        );
        return matchesQuery && matchesCategory && matchesCapacity && matchesEquipment;
      }),
    [category, equipment, minimumCapacity, query],
  );

  const navigate = (next: Screen, tab?: MainTab) => {
    setScreen(next);
    if (tab) setActiveTab(tab);
    setMessage("");
  };

  const openRoom = (room: Room) => {
    setSelectedRoom(room);
    navigate("room");
  };

  const goBack = () => {
    if (screen === "room") navigate(activeTab === "explore" ? "explore" : "home");
    else if (screen === "availability") navigate("room");
    else if (screen === "request") navigate("availability");
    else if (screen === "gallery") navigate("room");
    else if (screen === "edit-profile") navigate("profile", "profile");
    else if (screen === "filters") navigate("explore", "explore");
    else navigate("home", "home");
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const date = `2026-11-${String(selectedDay).padStart(2, "0")}`;
    const nextBooking: Booking = {
      id: `SAL-2026-${String(143 + bookings.length - initialBookings.length).padStart(4, "0")}`,
      roomId: selectedRoom.id,
      date,
      start: slots[selectedSlot],
      end: slots[selectedSlot + 1] ?? "18:00",
      subject,
      participants,
      note,
      status: "En attente",
    };
    setBookings((current) => [nextBooking, ...current]);
    navigate("success");
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
  };

  const filteredBookings = bookings.filter((booking) => filter === "Toutes" || booking.status === filter);
  const pendingBookings = bookings.filter((booking) => booking.status === "En attente");
  const isMainScreen = ["home", "explore", "reservations", "profile"].includes(screen);
  const showBottomNav = isMainScreen || screen === "admin";

  const navTo = (tab: MainTab) => {
    navigate(tab, tab);
  };

  const toggleEquipment = (item: string) => {
    setEquipment((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  };

  const renderReservation = (booking: Booking) => {
    const room = roomFor(booking);
    const statusClass = booking.status === "Confirmée" ? "confirmed" : booking.status === "Refusée" ? "rejected" : "pending";
    return (
      <article className="booking-card" key={booking.id}>
        <div className="booking-card__top">
          <h3>{room.name}</h3>
          <span className={`status status--${statusClass}`}>
            {booking.status === "Confirmée" ? <Check size={15} /> : booking.status === "Refusée" ? <X size={15} /> : <Clock3 size={15} />}
            {booking.status}
          </span>
        </div>
        <p className="booking-card__subject">{booking.subject}</p>
        <div className="booking-card__line"><CalendarDays size={18} />{formatDate(booking.date, { day: "numeric", month: "short", year: "numeric" })} · {booking.start} – {booking.end}</div>
        <p className="booking-card__id">{booking.id} · {booking.participants} participants</p>
        {booking.status === "Refusée" && <p className="booking-card__reason">La salle était indisponible sur le créneau demandé.</p>}
      </article>
    );
  };

  const renderMainContent = () => {
    switch (screen) {
      case "home":
        return (
          <div className="page-content">
            <div className="welcome-line"><div><p className="eyebrow">ESPACE SALIB</p><p className="muted">Bonjour {profile.firstName},</p></div><button className="avatar-button" onClick={() => navTo("profile")} aria-label="Ouvrir mon profil"><Image src={profileImage} alt="" width={46} height={46} /></button></div>
            <h1 className="hero-title">Place à vos idées.</h1>
            <p className="lead">Trouvez le bon espace pour votre prochain projet.</p>
            <label className="search-field"><Search size={20} /><input placeholder="Rechercher une salle..." value={query} onChange={(event) => { setQuery(event.target.value); navigate("explore", "explore"); }} /><span className="sr-only">Rechercher une salle</span></label>
            <button className="reservation-shortcut" onClick={() => navigate("reservations", "reservations")}><CalendarCheck size={22} /><span><strong>Mes réservations</strong><small>Retrouvez toutes vos demandes</small></span><ChevronRight size={22} /></button>
            <div className="section-heading"><div><p className="eyebrow">VOTRE ESPACE</p><h2>Choisissez votre ambiance</h2></div></div>
            <div className="category-row">{categories.map((item) => <button className={`category-chip${category === item ? " is-active" : ""}`} onClick={() => { setCategory(category === item ? "" : item); navigate("explore", "explore"); }} key={item}>{item}</button>)}</div>
            <div className="section-heading"><div><p className="eyebrow">À DÉCOUVRIR</p><h2>Salles disponibles</h2></div><button className="text-link" onClick={() => navTo("explore")}>Tout voir <ArrowRight size={17} /></button></div>
            <div className="room-grid room-grid--home">{rooms.slice(0, 2).map((room, index) => <RoomCard key={room.id} room={room} priority={index === 0} onSelect={openRoom} />)}</div>
          </div>
        );
      case "explore":
        return (
          <div className="page-content">
            <p className="eyebrow">TROUVEZ VOTRE ESPACE</p><h1>Explorer les salles</h1><p className="lead">Le bon espace, pour chaque occasion.</p>
            <label className="search-field"><Search size={20} /><input placeholder="Rechercher une salle..." value={query} onChange={(event) => setQuery(event.target.value)} /><span className="sr-only">Rechercher une salle</span></label>
            <div className="filter-toolbar"><button className="outline-button" onClick={() => navigate("filters")}><SlidersHorizontal size={18} />Filtres{(minimumCapacity > 0 || equipment.length > 0) && <span className="filter-count">{equipment.length + (minimumCapacity > 0 ? 1 : 0)}</span>}</button><select aria-label="Filtrer par type" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Tous les types</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><span className="results-count">{filteredRooms.length} salle{filteredRooms.length > 1 ? "s" : ""} · Établissement SALIB</span></div>
            {filteredRooms.length ? <div className="room-grid">{filteredRooms.map((room, index) => <RoomCard key={room.id} room={room} priority={index === 0} onSelect={openRoom} />)}</div> : <div className="empty-state"><Search size={28} /><h2>Aucune salle trouvée</h2><p>Modifiez votre recherche ou vos filtres.</p><button className="outline-button" onClick={() => { setQuery(""); setCategory(""); setMinimumCapacity(0); setEquipment([]); }}>Réinitialiser</button></div>}
          </div>
        );
      case "room":
        return (
          <div className="page-content page-content--detail">
            <button className="back-link" onClick={goBack}><ArrowLeft size={18} />Retour au catalogue</button>
            <div className="detail-hero"><Image src={selectedRoom.image} alt={`Salle ${selectedRoom.name}`} fill priority sizes="(max-width: 700px) 100vw, 900px" /></div>
            <div className="detail-caption"><span>{selectedRoom.category.toUpperCase()} / SALIB</span><button className="text-link" onClick={() => navigate("gallery")}><ImageIcon size={16} />Voir la galerie</button></div>
            <div className="detail-title-row"><h1>{selectedRoom.name}</h1><span className="status status--available"><Check size={15} />Disponible</span></div>
            <p className="detail-facts"><span><Users size={18} />{selectedRoom.capacity} personnes max.</span><span><MapPin size={18} />{selectedRoom.building} · {selectedRoom.floor}</span></p>
            <p className="detail-description">{selectedRoom.description}</p>
            <div className="section-heading"><div><p className="eyebrow">TOUT POUR BIEN TRAVAILLER</p><h2>Équipements</h2></div></div>
            <div className="feature-grid">{selectedRoom.features.map((feature) => <div className="feature-tile" key={feature}>{feature.includes("Wi-Fi") ? <Wifi size={20} /> : feature.includes("Écran") || feature.includes("Vidéoprojecteur") ? <Monitor size={20} /> : feature.includes("Climatisation") ? <Snowflake size={20} /> : <Pencil size={20} />}{feature}</div>)}</div>
            <div className="location-tile"><MapPin size={19} /><strong>{selectedRoom.building} · Salle {selectedRoom.roomNumber}</strong></div>
            <div className="detail-footer"><button className="primary-button" onClick={() => navigate("availability")}>Réserver cette salle <ArrowRight size={18} /></button><small>Votre demande sera validée par SALIB.</small></div>
          </div>
        );
      case "availability":
        return (
          <div className="page-content narrow-content">
            <PageHeader title="Disponibilités" onBack={goBack} />
            <div className="room-mini"><Image src={selectedRoom.image} alt="" width={72} height={68} /><div><strong>{selectedRoom.name}</strong><small>{selectedRoom.capacity} personnes · {selectedRoom.building}</small></div></div>
            <div className="month-heading"><h2>Novembre 2026</h2><CalendarDays size={20} /></div>
            <div className="calendar-grid" role="group" aria-label="Choisir le jour de réservation">{["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span className="calendar-weekday" key={`${day}-${index}`}>{day}</span>)}{Array.from({ length: 6 }, (_, index) => <span key={`empty-${index}`} />)}{Array.from({ length: 30 }, (_, index) => { const day = index + 1; const unavailable = day < 13 || [14, 15, 21, 22, 28, 29].includes(day); return <button key={day} disabled={unavailable} className={`calendar-day${selectedDay === day ? " is-selected" : ""}`} onClick={() => setSelectedDay(day)}>{day}</button>; })}</div>
            <p className="calendar-note">Les dates grisées ne sont pas disponibles.</p>
            <h3 className="slot-date">{formatDate(`2026-11-${String(selectedDay).padStart(2, "0")}`, { weekday: "long", day: "numeric", month: "long" })}</h3>
            <div className="slot-grid">{slotLabels.map((label, index) => <button key={label} disabled={index === 1} className={`slot-button${selectedSlot === index ? " is-selected" : ""}`} onClick={() => setSelectedSlot(index)}>{label}{index === 1 && <LockKeyhole size={15} />}</button>)}</div>
            <div className="success-banner"><Check size={18} />{slotLabels[selectedSlot]} : créneau disponible</div>
            <button className="primary-button full-button" onClick={() => navigate("request")}>Choisir ce créneau <ArrowRight size={18} /></button>
            <p className="form-hint centered">Les horaires occupés ne sont pas sélectionnables.</p>
          </div>
        );
      case "request":
        return (
          <div className="page-content narrow-content">
            <PageHeader title="Votre réservation" onBack={goBack} />
            <div className="room-mini"><Image src={selectedRoom.image} alt="" width={72} height={68} /><div><strong>{selectedRoom.name}</strong><small>{selectedRoom.capacity} personnes max. · {selectedRoom.building}</small></div></div>
            <form className="form-stack" onSubmit={submitBooking}>
              <label className="field-label">Date de réservation<input value={`${formatDate(`2026-11-${String(selectedDay).padStart(2, "0")}`)}`} readOnly /></label>
              <div className="form-row"><label className="field-label">Heure de début<input value={slots[selectedSlot]} readOnly /></label><label className="field-label">Heure de fin<input value={slots[selectedSlot + 1] ?? "18:00"} readOnly /></label></div>
              <label className="field-label">Objet de la réservation<input required value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={100} /></label>
              <label className="field-label">Nombre de participants<input type="number" min={1} max={selectedRoom.capacity} required value={participants} onChange={(event) => setParticipants(Number(event.target.value))} /><small>Capacité maximale : {selectedRoom.capacity} personnes.</small></label>
              <label className="field-label">Informations supplémentaires · facultatif<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={300} /></label>
              {participants > selectedRoom.capacity && <p className="error-message">Le nombre de participants dépasse la capacité de la salle.</p>}
              <div className="success-banner"><Check size={18} />Créneau disponible · Vérifié à l’instant</div>
              <button className="primary-button full-button" type="submit" disabled={!subject.trim() || participants > selectedRoom.capacity}>Soumettre ma demande <ArrowRight size={18} /></button>
              <p className="form-hint centered">La réservation sera effective après validation.</p>
            </form>
          </div>
        );
      case "success":
        return (
          <div className="page-content narrow-content success-page"><div className="success-icon"><Check size={31} /></div><p className="eyebrow">DEMANDE ENVOYÉE</p><h1>Votre demande est bien partie.</h1><p className="lead">L’équipe SALIB vous informera dès qu’une décision aura été prise.</p><div className="success-summary"><small>DEMANDE N° {bookings[0]?.id}</small><span className="status status--pending"><Clock3 size={15} />En attente</span><h2>{selectedRoom.name}</h2><p><CalendarDays size={17} />{formatDate(`2026-11-${String(selectedDay).padStart(2, "0")}`)}</p><p><Clock3 size={17} />{slotLabels[selectedSlot]}</p><p><Users size={17} />{participants} participants</p><p><MapPin size={17} />{selectedRoom.building} · Salle {selectedRoom.roomNumber}</p></div><button className="primary-button full-button" onClick={() => navTo("reservations")}>Voir mes réservations</button><button className="outline-button full-button" onClick={() => navTo("home")}>Retour à l’accueil</button></div>
        );
      case "reservations":
        return (
          <div className="page-content"><p className="eyebrow">VOTRE ACTIVITÉ</p><h1>Mes réservations</h1><p className="lead">Vos projets, au même endroit.</p><div className="tabs-row">{(["Toutes", "En attente", "Confirmée", "Refusée"] as ReservationFilter[]).map((item) => <button className={`tab-chip${filter === item ? " is-active" : ""}`} key={item} onClick={() => setFilter(item)}>{item === "Confirmée" ? "Confirmées" : item === "Refusée" ? "Refusées" : item}</button>)}</div><p className="results-count">{filteredBookings.length} demande{filteredBookings.length > 1 ? "s" : ""}</p><div className="booking-list">{filteredBookings.map(renderReservation)}</div>{filteredBookings.length === 0 && <div className="empty-state"><CalendarDays size={28} /><h2>Rien à afficher</h2><p>Vos réservations apparaîtront ici.</p><button className="primary-button" onClick={() => navTo("explore")}>Explorer les salles</button></div>}</div>
        );
      case "profile":
        return (
          <div className="page-content narrow-content"><p className="eyebrow">VOTRE COMPTE</p><h1>Mon profil</h1><div className="profile-card"><Image src={profileImage} alt="" width={84} height={84} /><h2>{profile.firstName} {profile.lastName}</h2><p>Membre de l’établissement SALIB</p></div><div className="profile-section"><h2>Informations personnelles</h2><dl><div><dt>Prénom et nom</dt><dd>{profile.firstName} {profile.lastName}</dd></div><div><dt>Adresse e-mail</dt><dd>{profile.email}</dd></div><div><dt>Téléphone</dt><dd>{profile.phone}</dd></div></dl></div><div className="profile-actions"><button onClick={() => navigate("edit-profile")}><Pencil size={20} />Modifier mon profil<ChevronRight size={19} /></button><button onClick={() => setMessage("Un lien de réinitialisation a été envoyé à votre adresse e-mail.")}><LockKeyhole size={20} />Changer le mot de passe<ChevronRight size={19} /></button><button onClick={() => navigate("admin")}><LayoutDashboard size={20} />Espace responsable<ChevronRight size={19} /></button><button className="logout-action" onClick={() => navigate("login")}><LogOut size={20} />Se déconnecter<ChevronRight size={19} /></button></div>{message && <div className="success-banner"><Check size={18} />{message}</div>}<p className="profile-footer">SALIB – Réservation de salles · Version 1.0</p></div>
        );
      case "edit-profile":
        return (
          <div className="page-content narrow-content"><PageHeader title="Modifier mon profil" onBack={goBack} /><p className="eyebrow">VOS INFORMATIONS</p><h1>Gardez vos coordonnées à jour.</h1><form className="form-stack" onSubmit={(event) => { event.preventDefault(); navigate("profile", "profile"); setMessage("Votre profil a été mis à jour."); }}><label className="field-label">Nom<input required value={profile.lastName} onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} /></label><label className="field-label">Prénom<input required value={profile.firstName} onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} /></label><label className="field-label">Adresse e-mail<input required type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label><label className="field-label">Téléphone<input type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label><button className="primary-button full-button">Enregistrer les modifications</button><button type="button" className="outline-button full-button" onClick={goBack}>Annuler</button></form></div>
        );
      case "filters":
        return (
          <div className="page-content narrow-content"><PageHeader title="Filtrer les salles" onBack={goBack} /><p className="eyebrow">PERSONNALISEZ VOTRE RECHERCHE</p><h1>Un espace à votre mesure</h1><p className="lead">Affinez votre recherche selon vos besoins.</p><div className="form-stack"><label className="field-label">Capacité minimale<select value={minimumCapacity} onChange={(event) => setMinimumCapacity(Number(event.target.value))}><option value={0}>Toutes les capacités</option><option value={10}>10 personnes</option><option value={20}>20 personnes</option><option value={50}>50 personnes</option></select></label><div className="field-label">Type de salle{categories.map((item) => <button className={`choice-row${category === item ? " is-selected" : ""}`} key={item} onClick={() => setCategory(category === item ? "" : item)}>{item}<span>{category === item ? "●" : "○"}</span></button>)}</div><div className="field-label">Équipements souhaités<div className="equipment-options">{equipmentOptions.map((item) => <button className={`equipment-chip${equipment.includes(item) ? " is-active" : ""}`} key={item} onClick={() => toggleEquipment(item)}>{equipment.includes(item) && <Check size={14} />}{item}</button>)}</div></div><button className="primary-button full-button" onClick={() => navigate("explore", "explore")}>Afficher {filteredRooms.length} salle{filteredRooms.length !== 1 ? "s" : ""}</button><button className="outline-button full-button" onClick={() => { setMinimumCapacity(0); setCategory(""); setEquipment([]); }}>Réinitialiser</button></div></div>
        );
      case "gallery":
        return (
          <div className="page-content narrow-content"><PageHeader title={`Galerie · ${selectedRoom.name}`} onBack={goBack} /><div className="gallery-main"><Image src={selectedRoom.image} alt={`${selectedRoom.name} — vue principale`} fill sizes="(max-width: 700px) 100vw, 800px" /></div><h1>Un espace pour se retrouver</h1><p className="lead">{selectedRoom.description}</p><div className="gallery-grid">{selectedRoom.gallery.map((image, index) => <div className="gallery-image" key={`${image}-${index}`}><Image src={image} alt={`${selectedRoom.name} — vue ${index + 2}`} fill sizes="(max-width: 700px) 50vw, 400px" /></div>)}</div><p className="results-count">{selectedRoom.capacity} personnes · {selectedRoom.building} · Salle {selectedRoom.roomNumber}</p><button className="primary-button full-button" onClick={() => navigate("availability")}>Réserver cette salle</button></div>
        );
      case "admin":
        return (
          <div className="page-content"><p className="eyebrow">GESTION SALIB</p><h1>Demandes à traiter</h1><p className="lead">Retrouvez les demandes en attente de validation.</p><p className="results-count">{pendingBookings.length} demande{pendingBookings.length > 1 ? "s" : ""} en attente</p><div className="booking-list">{pendingBookings.map((booking) => { const room = roomFor(booking); return <article className="booking-card" key={booking.id}><div className="booking-card__top"><h3>{room.name}</h3><span className="status status--pending"><Clock3 size={15} />En attente</span></div><p className="booking-card__subject">{booking.subject}</p><div className="booking-card__line"><CalendarDays size={18} />{formatDate(booking.date)} · {booking.start} – {booking.end}</div><p className="booking-card__id">{booking.id} · {booking.participants} participants</p><div className="admin-actions"><button className="outline-button" onClick={() => updateBookingStatus(booking.id, "Refusée")}><XCircle size={17} />Refuser</button><button className="primary-button" onClick={() => updateBookingStatus(booking.id, "Confirmée")}><CheckCircle2 size={17} />Confirmer</button></div></article>; })}</div>{pendingBookings.length === 0 && <div className="empty-state"><CheckCircle2 size={28} /><h2>Tout est à jour</h2><p>Aucune demande en attente pour le moment.</p></div>}<button className="outline-button" onClick={() => navTo("profile")}>Retour au profil</button></div>
        );
      case "login":
      case "signup":
      case "recovery":
        return (
          <div className="auth-page"><button className="brand-lockup" onClick={() => navigate("home")}><Grid2X2 size={22} /> SALIB</button><p className="eyebrow">{screen === "recovery" ? "SÉCURITÉ DU COMPTE" : "VOTRE ESPACE SALIB"}</p><h1>{screen === "login" ? "Heureux de vous retrouver." : screen === "signup" ? "Bienvenue chez SALIB" : "Un oubli, ça arrive."}</h1><p className="lead">{screen === "login" ? "Connectez-vous pour organiser votre prochaine rencontre." : screen === "signup" ? "Quelques informations pour vous retrouver." : "Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation."}</p><form className="form-stack" onSubmit={(event) => { event.preventDefault(); if (screen === "recovery") { setMessage("Un lien de réinitialisation a été envoyé à votre adresse e-mail."); } else navigate("home", "home"); }}><label className="field-label">Adresse e-mail<input type="email" defaultValue={screen === "login" ? profile.email : ""} placeholder="camille.martin@salib.fr" required /></label>{screen === "signup" && <><label className="field-label">Nom<input required defaultValue="Martin" /></label><label className="field-label">Prénom<input required defaultValue="Camille" /></label><label className="field-label">Téléphone<input type="tel" placeholder="06 12 34 56 78" /></label></>}{screen !== "recovery" && <label className="field-label">Mot de passe<input type="password" placeholder="Au moins 8 caractères" minLength={8} required /></label>}{screen === "login" && <button type="button" className="text-link auth-forgot" onClick={() => navigate("recovery")}>Mot de passe oublié ?</button>}<button className="primary-button full-button">{screen === "login" ? "Se connecter" : screen === "signup" ? "Créer mon compte" : "Envoyer le lien"}</button></form>{message && <div className="success-banner"><Check size={18} />{message}</div>}<button className="outline-button full-button" onClick={() => navigate(screen === "signup" ? "login" : "signup")}>{screen === "signup" ? "Déjà un compte ? Se connecter" : "Créer un compte"}</button><button className="text-link auth-demo" onClick={() => navigate("home", "home")}>Continuer en mode démonstration <ArrowRight size={16} /></button></div>
        );
    }
  };

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <button className="brand-lockup" onClick={() => navTo("home")}><Grid2X2 size={22} /> SALIB</button>
        <p className="sidebar-label">ESPACE PERSONNEL</p>
        <nav className="sidebar-nav" aria-label="Navigation principale">
          <NavButton icon={<House size={19} />} label="Accueil" active={activeTab === "home"} onClick={() => navTo("home")} />
          <NavButton icon={<Search size={19} />} label="Explorer" active={activeTab === "explore"} onClick={() => navTo("explore")} />
          <NavButton icon={<CalendarCheck size={19} />} label="Réservations" active={activeTab === "reservations"} onClick={() => navTo("reservations")} />
          <NavButton icon={<UserRound size={19} />} label="Mon profil" active={activeTab === "profile"} onClick={() => navTo("profile")} />
        </nav>
        <div className="sidebar-help"><Sparkles size={20} /><strong>Un espace pour chaque idée.</strong><p>Découvrez les salles de votre établissement.</p><button onClick={() => navTo("explore")}>Explorer <ArrowRight size={15} /></button></div>
        <button className="sidebar-user" onClick={() => navTo("profile")}><Image src={profileImage} alt="" width={38} height={38} /><span><strong>{profile.firstName} {profile.lastName}</strong><small>Membre SALIB</small></span><ChevronDown size={16} /></button>
      </aside>
      <div className="main-column">
        <header className="desktop-header"><div><p className="breadcrumb">SALIB <ChevronRight size={15} /> {screen === "home" ? "Accueil" : screen === "explore" ? "Explorer les salles" : screen === "reservations" ? "Mes réservations" : screen === "profile" ? "Mon profil" : "Votre espace"}</p><p className="header-caption">Réservation de salles</p></div><button className="header-profile" onClick={() => navTo("profile")}><span>{profile.firstName} {profile.lastName}</span><Image src={profileImage} alt="" width={40} height={40} /></button></header>
        <main className={isMainScreen ? "main-content" : "main-content main-content--subpage"}>{renderMainContent()}</main>
      </div>
      {showBottomNav && <nav className="bottom-nav" aria-label="Navigation mobile"><NavButton icon={<House size={21} />} label="Accueil" active={activeTab === "home"} onClick={() => navTo("home")} /><NavButton icon={<Search size={21} />} label="Explorer" active={activeTab === "explore"} onClick={() => navTo("explore")} /><NavButton icon={<CalendarCheck size={21} />} label="Réservations" active={activeTab === "reservations"} onClick={() => navTo("reservations")} /><NavButton icon={<UserRound size={21} />} label="Profil" active={activeTab === "profile"} onClick={() => navTo("profile")} /></nav>}
      <div className="mobile-safe-area" />
    </div>
  );
}

function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <div className="page-header"><button className="icon-button" onClick={onBack} aria-label="Retour"><ArrowLeft size={21} /></button><h2>{title}</h2></div>;
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={`nav-button${active ? " is-active" : ""}`} onClick={onClick}>{icon}<span>{label}</span></button>;
}
