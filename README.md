# 🎓 AlternHub

**AlternHub** est une plateforme SaaS française dédiée aux étudiants en alternance, facilitant leur recherche d'offres, la gestion de leurs candidatures et le matching avec des entreprises et écoles.

> **Status**: MVP actif — Phase V4 (Redesign Recruteurs & CV dual-view)

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Environnement](#environnement)
- [Structure du projet](#structure-du-projet)
- [Comptes de démo](#comptes-de-démo)
- [Contribution](#contribution)

---

## 🎯 Vue d'ensemble

AlternHub permet à trois catégories d'utilisateurs de collaborer :

| Rôle | Capacités |
|------|-----------|
| **👨‍🎓 Étudiant** | Parcourir offres, gérer candidatures, construire CV, explorer écoles, simuler salaires |
| **🏢 Recruteur** | Créer offres, consulter candidats (swipe/list), gérer candidatures, pipeline de recrutement |
| **🔧 Admin** | Gérer utilisateurs, modérer contenu, statistiques plateforme |

---

## ✨ Fonctionnalités

### Pour les étudiants

- **📊 Tableau de bord** — AlternScore, activité, stats de recherche
- **📑 Mon CV** — Dual-view : CV AlternHub généré auto OU CV personnel importé (PDF)
- **👤 Mon Profil** — Éditer données (école, entreprise, localisation, réseaux, documents, lettre de motivation)
- **🔍 Recherche d'offres** — Scraping alternance offers, matching intelligent avec score de compétences
- **📚 Écoles** — Annuaire avec statistiques (taux réussite, alternance, emploi), contacts premium
- **💼 Candidatures** — Kanban board, statuts (appliqué, refusé, entretien, accepté)
- **🎯 Mes Expériences** — Tracker missions complétées, skills associées, impacts quantifiés
- **📈 Ma Carrière** — Roadmaps carrière, testimonials alumni, skill gaps
- **💰 Simulateur de salaire** — Estimation par niveau, ville, secteur
- **📰 Bons plans** — Ressources partagées par communauté

### Pour les recruteurs

- **📋 Créer offres** — Niveau, compétences requises/optionnelles, salaire, durée, télétravail
- **👥 Candidats** — Mode swipe + list view, match score, tri urgence, CV et lettre de motivation visibles
- **🔗 Pipeline** — Suivre étapes (contact → entretien écrit → vidéo → hired/interne)
- **🎁 Subscription tiers** — FREE (quotas limités) / PRO / PREMIUM (contacts écoles)

### Admin

- **🛡️ Modération** — Vérification offres, gestion utilisateurs
- **📊 Analytics** — Stats plateforme, activity logs

---

## 🛠️ Stack technique

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14.2.14 (App Router), React 18, TypeScript |
| **UI** | Tailwind CSS + Radix UI (shadcn/ui components) |
| **Backend** | Next.js API Routes, Node.js |
| **DB** | Prisma ORM + SQLite (dev), PostgreSQL (prod ready) |
| **Auth** | NextAuth v4 (JWT, credentials provider) |
| **Icons** | Lucide React |
| **Date** | date-fns |
| **Build** | Webpack, TypeScript compiler |

---

## 🏗️ Architecture

### Database Schema (Prisma)

```
User
├── Profile (bio, école, entreprise, documents)
├── UserSkill (compétences avec niveau)
├── Mission (expériences complétées)
├── Candidature (suivi des applications)
├── RecruteurProfile (si rôle = RECRUTEUR)

Offre
├── OffreSkill (compétences requises/optionnelles avec weight)
├── Ecole (relation with schools)

Ecole
├── logoUrl (Clearbit)
└── stats (taux réussite, etc.)

CareerPath
Bons plans
```

### Routes & Features

```
/student
  ├── /dashboard         → AlternScore, stats
  ├── /cv                → Dual-view (AlternHub | Imported)
  ├── /profil            → Profile editor
  ├── /candidatures      → Kanban board
  ├── /missions          → Mission tracker
  ├── /skills            → Skill manager
  ├── /offres            → Job browser + matching
  ├── /carriere          → Career paths
  ├── /ecoles            → School directory
  ├── /bons-plans        → Resources
  └── /simulateur        → Salary calculator

/recruteur
  ├── /dashboard         → Overview, quotas
  ├── /candidats         → Swipe + List view
  ├── /offres            → Offer management
  ├── /offres/new        → Create offer
  └── /pipeline          → Recruitment pipeline

/admin
  └── [TBD]              → Admin dashboard

/auth
  └── /login             → 3 roles login + demo buttons
```

### Algorithme de Matching

**Weighted Jaccard** (TypeScript, `/lib/matching.ts`):
- Compare user skills vs offre requirements
- Calcul : (skillsMatched / totalSkillsRequired) × 100
- Pénalités pour skills requis manquants (×0.88 par skill missing, max 3)
- Résultat : score 0–100

```typescript
computeMatchScore(userSkills, offreSkills) → number
```

### Upload Files

- Route : `POST /api/upload`
- Types acceptés : PDF, PPTX, images
- Storage : `public/uploads/{userId}/{type}-{timestamp}.{ext}`
- Returns : `{ url, filename, size }`

---

## 📦 Installation

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ou **yarn**
- **Git**

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/Cyber-Avenir/AlterNHub.git
cd AlterNHub

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec tes variables

# 4. Initialiser la DB
npx prisma db push

# 5. Seeder les données de démo
npx ts-node prisma/seed.ts

# 6. Lancer le dev server
npm run dev
```

---

## 🚀 Démarrage rapide

```bash
npm run dev
# → http://localhost:3000 (ou 3001, 3002 si ports occupés)
```

### Pages clés

- **Login** : http://localhost:3000/auth/login
  - Boutons démo : 👨‍🎓 Étudiant | 🏢 Recruteur | 🔧 Admin
  - Ou inscription custom avec email/password

- **Student Dashboard** : http://localhost:3000/student/dashboard (après login)

- **Recruiter Dashboard** : http://localhost:3000/recruteur/dashboard

---

## 🔐 Environnement

Créer `.env.local` à la racine :

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optionnel : Scraping, logos
CLEARBIT_API_KEY="optional"
```

Pour générer `NEXTAUTH_SECRET` :

```bash
openssl rand -base64 32
```

---

## 📂 Structure du projet

```
AlterNHub/
├── public/
│   ├── uploads/           # User-uploaded files
│   └── ...
├── prisma/
│   ├── schema.prisma      # DB schema
│   └── seed.ts            # Demo data
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── auth/
│   │   ├── student/       # Student routes
│   │   ├── recruteur/     # Recruiter routes
│   │   ├── admin/         # Admin routes
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Sidebars, layouts
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts        # NextAuth config
│   │   ├── matching.ts    # Matching algorithm
│   │   ├── prisma.ts      # Prisma client
│   │   └── utils.ts       # Utilities
│   ├── types/
│   │   └── next-auth.d.ts # Type augmentation
│   └── middleware.ts      # Route protection
├── .env.local             # Environment (git-ignored)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 🎮 Comptes de démo

Après seeding (`npx ts-node prisma/seed.ts`), utilise :

### Étudiant
- **Email** : `student@example.com`
- **Password** : `Student1234!`

### Recruteur
- **Email** : `recruteur@techcorp.fr`
- **Password** : `Recruteur1234!`
- **Tier** : PRO (avec quotas augmentés)

### Admin
- **Email** : `admin@alternhub.dev`
- **Password** : `Admin1234!`

> 💡 Ou utilise les boutons démo sur la page login pour précharger les données.

---

## 📝 Fonctionnalités en développement

- ✅ CV dual-view (AlternHub + imported)
- ✅ Matching intelligent avec scoring
- ✅ Recruteur swipe + list view
- ✅ Subscription tiers (FREE/PRO/PREMIUM)
- 🔄 Pipeline recrutement (contact → hired)
- 🔄 Scraping offres alternance (full integration)
- 🔄 Export PDF CV
- 🔄 Notifications & emails
- 🔄 Analytics & dashboards

---

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le repo
2. Crée une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit tes changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvre une Pull Request

### Style de code

- **TypeScript** strict mode
- **Tailwind CSS** pour les styles
- **Noms composants** PascalCase
- **Dossiers** snake_case
- **Variables** camelCase

---

## 📄 License

Ce projet est la propriété de **Cyber Avenir**. Tous droits réservés © 2026.

---

## 📞 Support

Pour questions ou bugs :
- 📧 Email : support@alternhub.dev
- 🐛 Issues : [GitHub Issues](https://github.com/Cyber-Avenir/AlterNHub/issues)
- 💬 Discussions : [GitHub Discussions](https://github.com/Cyber-Avenir/AlterNHub/discussions)

---

## 🎯 Feuille de route (Roadmap)

### Q1 2026
- [x] MVP étudiant (CV, candidatures, offres)
- [x] Profil & matching
- [x] Interface recruteur (swipe + list)

### Q2 2026
- [ ] Pipeline recrutement complet
- [ ] Notifications temps réel
- [ ] Export PDF/Word
- [ ] Analytics premium

### Q3 2026
- [ ] AI-powered recommendations
- [ ] Mobile app
- [ ] Intégrations ATS

---

**Made with ❤️ by the AlternHub Team**
