# Fasterz - Application VTC pour la Guyane 🚗

Fasterz est une application de VTC (Voiture de Transport avec Chauffeur) moderne conçue spécifiquement pour la Guyane française. Elle connecte les passagers avec des conducteurs professionnels pour des déplacements sûrs et efficaces.

## Fonctionnalités principales 🌟

### Pour les passagers
- Réservation de courses en temps réel
- Suivi en direct du trajet
- Estimation des prix avant la course
- Système de notation des conducteurs
- Historique des courses
- Chat intégré avec le conducteur
- Support client 24/7

### Pour les conducteurs
- Tableau de bord professionnel
- Gestion des courses en temps réel
- Suivi des gains
- Navigation optimisée
- Statut en ligne/hors ligne
- Support dédié

## Technologies utilisées 💻

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (Base de données et authentification)
- React Router
- React Query
- Leaflet (Cartographie)

## Prérequis 📋

- Node.js 18 ou supérieur
- npm ou yarn
- Un compte Supabase (pour le backend)

## Installation 🛠️

1. Clonez le repository :
```bash
git clone <votre-repo-url>
cd fasterz
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec vos variables d'environnement :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

## Structure du projet 📁

```
src/
├── components/     # Composants réutilisables
├── hooks/         # Hooks personnalisés
├── integrations/  # Intégrations (Supabase, etc.)
├── lib/           # Utilitaires et helpers
├── pages/         # Pages de l'application
└── styles/        # Styles globaux
```

## Utilisation 🚀

### En tant que passager

1. Créez un compte passager
2. Connectez-vous à l'application
3. Saisissez votre destination
4. Choisissez votre type de véhicule
5. Confirmez la course
6. Suivez votre trajet en temps réel

### En tant que conducteur

1. Créez un compte conducteur
2. Complétez votre profil avec les informations du véhicule
3. Attendez la validation de votre compte
4. Connectez-vous au tableau de bord conducteur
5. Passez en ligne pour recevoir des courses
6. Acceptez ou refusez les courses

## Fonctionnalités de sécurité 🔒

- Authentification sécurisée
- Vérification des conducteurs
- Suivi GPS en temps réel
- Système de notation bidirectionnel
- Support d'urgence 24/7

## Support 💬

Pour toute assistance :
- Email : support@fasterz.gf
- Téléphone : +594 XXX XXX XXX
- Chat in-app disponible 24/7

## Contribution 🤝

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence 📄

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## À venir 🔜

- Intégration de paiements mobiles
- Courses programmées
- Mode famille
- Programme de fidélité
- Version internationale