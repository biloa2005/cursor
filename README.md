# SALIB — Réservation de salles

Application web responsive de réservation de salles, réalisée avec Next.js, React et TypeScript à partir des maquettes du dossier `images/`.

## Prérequis

- Node.js 20.9 ou supérieur
- npm

## Installation

```bash
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

## Commandes

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Next.js. |
| `npm run lint` | Vérifie le code avec ESLint. |
| `npm run build` | Génère la version de production. |
| `npm start` | Démarre le serveur de production après la compilation. |

## Fonctionnalités

- Accueil et catalogue des salles avec recherche et filtres par catégorie, capacité et équipements.
- Consultation des caractéristiques, photos, équipements et localisation d’une salle.
- Parcours de réservation avec choix d’une date et d’un créneau, saisie du motif et du nombre de participants.
- Consultation et filtrage des demandes : en attente, confirmées ou refusées.
- Interface de démonstration destinée à un responsable pour confirmer ou refuser les demandes.
- Consultation et modification du profil, écrans de connexion, d’inscription et de récupération du mot de passe.
- Navigation adaptée aux petits écrans et aux ordinateurs.

## Structure du projet

```text
src/
  app/
    globals.css       Styles globaux et dispositions responsives
    layout.tsx        Mise en page et métadonnées de l’application
    page.tsx          Page d’entrée
  components/
    booking-app.tsx   Parcours et écrans de l’application
    room-card.tsx     Carte réutilisable d’une salle
  lib/
    data.ts           Types et données de démonstration
public/
  rooms/              Photos affichées dans l’application
images/               Maquettes de référence
```

Les salles et les réservations initiales sont définies dans `src/lib/data.ts`. Les photos utilisées par l’application se trouvent dans `public/rooms/`; les maquettes d’origine sont conservées dans `images/`.

## Périmètre de la démonstration

Cette application est un prototype d’interface, et non un service de réservation prêt pour la production :

- Aucune base de données, API ou authentification réelle n’est configurée.
- La connexion, l’inscription et la récupération du mot de passe sont des écrans de démonstration.
- Les demandes et leurs changements de statut sont conservés dans le stockage local du navigateur (`localStorage`) sur cet appareil.
- Les données du profil sont temporaires ; elles ne sont pas enregistrées dans un compte.
- Les salles, créneaux et disponibilités sont des exemples prédéfinis ; il n’y a pas de vérification côté serveur.

Avant une mise en production, connecter l’interface à une API sécurisée et à une base de données, ajouter une authentification, puis vérifier les disponibilités et les capacités côté serveur.
