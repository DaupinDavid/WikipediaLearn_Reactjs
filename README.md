# Wikipedia Learn — React.js
> **Liens du projet en ligne :** 🔗 [![Déployé sur Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://69b4d438f91a71e58751a987--wikipedialearn-react.netlify.app/)

Wikipedia Learn est une application web interactive conçue pour gamifier l'apprentissage.

Développée avec **React.js** et **CSS pur**, elle propose des parcours d'apprentissage chronométrés, un système d'expérience (XP) persistant via **Zustand**, et une interface utilisateur découpée en composants réutilisables.

Ce projet démontre ma capacité à concevoir des architectures frontend modulaires, à gérer des états complexes et à structurer une application React sans framework.

---


## Fonctionnalités

- 3 niveaux progressifs : Débutant → Intermédiaire → Expert
- Cours de révision avant chaque quiz
- Timer de 45 secondes par question
- Système XP et badges
- Examen final déblocable (3 séries de 20 questions)
- Mode Survie : 50 questions, une seule erreur élimine
- Progression sauvegardée en localStorage
- Architecture modulaire avec sous-composants et CSS dédié

---

## Installation et lancement

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Structure du projet

```
wikipedia-learn/
├── vite.config.js         ← Config Vite
├── package.json           ← Dépendances
├── index.html             ← Point d'entrée HTML
│
└── src/
    ├── main.jsx           ← Point d'entrée React
    ├── App.jsx            ← Composant racine + routage
    ├── index.css          ← Styles globaux + animations
    │
    ├── data/
    │   ├── questions.js   ← Toutes les questions (60)
    │   └── courses.js     ← Contenu des cours
    │
    ├── store/
    │   └── store.js       ← État global Zustand (XP, badges, progression)
    │
    ├── types/
    │   └── index.js       ← Constantes (NIVEAUX)
    │
    └── sections/
        ├── Accueil.jsx        ← Écran d'accueil
        ├── Accueil.css
        ├── Cours.jsx          ← Contenu du cours
        ├── Cours.css
        ├── Quiz.jsx           ← Quiz interactif (timer 45s)
        ├── Quiz.css
        ├── Examen.jsx         ← Examen final (3 séries)
        ├── Examen.css
        ├── ModeSurvie.jsx     ← Mode Survie (1 vie, 50 questions)
        │
        ├── CarteExamen/       ← Carte examen final
        ├── CarteSurvie/       ← Carte mode survie
        ├── CoursContenu/      ← Contenu d'une section
        ├── CoursHeader/       ← En-tête du cours
        ├── CoursSommaire/     ← Sommaire du cours
        ├── CoursTermine/      ← Félicitations fin de cours
        ├── ExamenResultats/   ← Résultats de l'examen
        ├── ExamenSeries/      ← Indicateur de séries
        ├── GrilleNiveaux/     ← Cartes des 3 niveaux
        ├── Header/            ← Barre de navigation
        ├── ModalesAccueil/    ← Modales (réinit, badge)
        ├── ProgressionGlobale/← Barre de progression
        ├── QuizExplication/   ← Explication après réponse
        ├── QuizQuestion/      ← Carte de question
        ├── QuizResultats/     ← Résultats du quiz
        ├── QuizTimer/         ← Timer visuel
        ├── SectionBadges/     ← Affichage des badges
        ├── SurvieFin/         ← Écran fin de survie
        ├── SurvieIntro/       ← Écran intro survie
        └── SurvieQuestion/    ← Question en mode survie
```

---

## Différences React → Next.js

| React.js (cette version) | Next.js (version avancée) |
|---|---|
| `index.html` | `src/app/layout.tsx` |
| `src/main.jsx` | `src/app/layout.tsx` |
| `src/App.jsx` | `src/app/page.tsx` |
| `src/index.css` | `src/app/globals.css` |
| `vite.config.js` | `next.config.mjs` |
| port : 5173 | port : 3000 |
| CSS pur | Tailwind CSS + shadcn/ui |
| JavaScript / JSX | TypeScript / TSX |
| Pas de SSR | SSR / SSG disponible |

---

## Déploiement

```bash
# Build production
npm run build
npm run preview
```