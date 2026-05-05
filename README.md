# Dourous-Net — Algeria's Digital Learning Platform

**ISI 2CP 2026 — Module Systèmes d'Information | Thème 4 : Éducation**

> Plateforme éducative algérienne de nouvelle génération — cours vidéo, quiz interactifs, suivi de progression et assistant IA, le tout déployé sur le cloud.

| | |
|---|---|
| **Live URL** | https://dourous-net-six.vercel.app |
| **GitHub** | https://github.com/islemredouane/Dourous-Net |
| **Compte étudiant** | `demo@dourous-net.dz` / `Demo1234!` |
| **Compte enseignant** | `teacher@dourous-net.dz` / `Teacher1234!` |
| **Thème** | 4 — Éducation |
| **Année** | 2025–2026 |

---

## Équipe

| Nom & Prénom | Rôle | Responsabilités |
|---|---|---|
| **Redouane Mohamed Islem** | Frontend Developer & UI/UX | Interface utilisateur complète, design system, animations, pages publiques, tableau de bord, intégration API |
| **Boukhanouf Abdelhak** | Frontend, 3D & Architecture Cloud | Scène 3D (Three.js), architecture Supabase, déploiement Vercel |
| **Zin Mohamed Khalil** | Backend & DevOps | Migrations SQL, politiques RLS, routes API, CI/CD |

---

## Vue d'ensemble

Dourous-Net est une **plateforme d'apprentissage en ligne** conçue pour les étudiants et enseignants algériens. Elle permet aux professeurs de créer et gérer des cours vidéo, et aux élèves de s'inscrire, suivre leur progression, passer des quiz et interagir avec un assistant IA.

### Rôles utilisateur

| Rôle | Accès | Description |
|---|---|---|
| **Étudiant** | `/dashboard`, `/sessions`, `/sessions/[id]`, `/sessions/[id]/learn` | Consulte les cours, s'inscrit, regarde les leçons, passe les quiz, upload ses devoirs |
| **Enseignant** | `/teacher`, `/teacher/new`, `/teacher/sessions/[id]/lessons`, `/teacher/sessions/[id]/quiz` | Crée des sessions, ajoute des leçons vidéo, crée des quiz, suit les soumissions |

---

## Fonctionnalités

### Côté Étudiant

| Fonctionnalité | Description | Page |
|---|---|---|
| Authentification | Inscription / connexion par email ou Google OAuth | `/auth` |
| Réinitialisation mot de passe | Envoi d'un email de reset + page de saisie du nouveau mot de passe | `/auth/forgot-password`, `/auth/update-password` |
| Onboarding | Formulaire de profil (niveau, domaine, bio) à la première connexion | `/onboarding` |
| Catalogue de cours | Grille de sessions avec filtres par catégorie | `/sessions` |
| Détail d'un cours | Titre, description, curriculum, professeur, bouton d'inscription | `/sessions/[id]` |
| Inscription | Un clic pour s'inscrire et accéder aux leçons | `/sessions/[id]` |
| Lecteur vidéo | Lecture des leçons YouTube/Vimeo intégrées avec suivi de complétion | `/sessions/[id]/learn/[lessonId]` |
| Quiz interactif | QCM avec timer, soumission et correction instantanée | `/sessions/[id]/quiz/[assignmentId]` |
| Résultats quiz | Score, pourcentage, réponses correctes / incorrectes | `/sessions/[id]/quiz/[assignmentId]/results` |
| Upload de devoir | Dépôt de PDF directement depuis le tableau de bord | `/dashboard` |
| Tableau de bord | Statistiques personnelles, cours inscrits, progression | `/dashboard` |
| Profil redesigné | Mise en page deux colonnes — carte profil + formulaire (nom, bio, niveau, domaine, avatar) | `/profile` |
| Assistant IA | Chat contextuel avec Google Gemini 1.5 Flash | Sidebar des leçons |

### Côté Enseignant

| Fonctionnalité | Description | Page |
|---|---|---|
| Tableau de bord enseignant | Liste de ses sessions avec statistiques (sessions, étudiants, heures) | `/teacher` |
| Créer une session | Formulaire : titre, description, catégorie, durée, thumbnail (upload image depuis l'appareil) | `/teacher/new` |
| Gérer les leçons | Ajouter / supprimer des leçons vidéo (titre, URL YouTube/Vimeo, durée) | `/teacher/sessions/[id]/lessons` |
| Créer des quiz | Créer des QCM avec questions, options et réponses correctes | `/teacher/sessions/[id]/quiz` |
| Soumissions des élèves | Tableau des devoirs reçus : nom, session, date, bouton "Open PDF" | `/teacher` |

---

## Architecture Technique

### Stack

| Couche | Technologie | Version | Rôle |
|---|---|---|---|
| Framework | Next.js | 16.2.4 | App Router, Server Components, API Routes |
| Langage | TypeScript | 5.x | Typage statique complet |
| Styling | Tailwind CSS | v4 | Utility-first CSS, dark mode |
| Composants UI | shadcn/ui + Radix UI | — | Composants accessibles |
| Animations | Framer Motion | 12.x | Scroll-driven animations, transitions |
| 3D | Three.js + React Three Fiber | 0.184 | Scène hero interactive |
| Base de données | Supabase (PostgreSQL) | 2.x | Données relationnelles + RLS |
| Authentification | Supabase Auth | — | Email/password + Google OAuth |
| Stockage fichiers | Supabase Storage | — | Thumbnails, PDFs de devoirs |
| Intelligence Artificielle | Google Gemini 1.5 Flash | — | Assistant pédagogique contextuel |
| Déploiement | Vercel | — | CI/CD automatique, CDN mondial |
| Icons | Lucide React | 1.x | Bibliothèque d'icônes SVG |
| Formulaires | React Hook Form + Zod | — | Validation côté client |
| Notifications | Sonner | 2.x | Toasts non-intrusifs |

---

## Structure du Projet

```
dourous-net/
├── src/
│   ├── app/                          # Pages (Next.js App Router)
│   │   ├── page.tsx                  # Landing page
│   │   ├── auth/                     # Connexion / inscription / reset mot de passe
│   │   │   ├── page.tsx              # Connexion & inscription
│   │   │   ├── forgot-password/      # Demande de reset par email
│   │   │   └── update-password/      # Saisie du nouveau mot de passe (via lien email)
│   │   ├── dashboard/                # Tableau de bord étudiant
│   │   ├── onboarding/               # Profil première connexion
│   │   ├── profile/                  # Modifier son profil
│   │   ├── sessions/                 # Catalogue et détail des cours
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Détail du cours
│   │   │       ├── learn/            # Lecteur de leçons
│   │   │       └── quiz/             # Quiz interactif
│   │   ├── teacher/                  # Espace enseignant
│   │   │   ├── page.tsx              # Dashboard enseignant
│   │   │   ├── new/                  # Créer une session
│   │   │   └── sessions/[id]/        # Gérer leçons et quiz
│   │   ├── teachers/[id]/            # Profil public d'un enseignant
│   │   ├── api/
│   │   │   ├── ai-coach/             # Route API Gemini
│   │   │   └── auth/callback/        # Callback OAuth Google
│   │   ├── terms/                    # CGU
│   │   ├── privacy/                  # Politique de confidentialité
│   │   └── cookies/                  # Politique cookies
│   ├── components/
│   │   ├── sections/                 # Sections de la landing page
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx   # Scroll Stack animé
│   │   │   ├── StatsSection.tsx
│   │   │   ├── CoursesPreviewSection.tsx
│   │   │   ├── TestimonialsSection.tsx  # Marquee infini
│   │   │   └── CtaSection.tsx
│   │   ├── layout/                   # Navbar, Footer, BottomNav (mobile), PageWrapper
│   │   ├── auth/                     # Formulaire auth
│   │   ├── dashboard/                # Stats, liste cours, upload
│   │   ├── teacher/                  # Formulaires enseignant
│   │   ├── learn/                    # Lecteur vidéo, sidebar, AI Coach
│   │   ├── sessions/                 # SessionCard, filtres, bouton d'inscription
│   │   ├── quiz/                     # QuizTaker, QuizResults
│   │   ├── profile/                  # Formulaire profil
│   │   ├── 3d/                       # Scène Three.js
│   │   ├── shared/                   # GlassCard, GradientText, LogoIcon (SVG), Spinner...
│   │   └── ui/                       # Boutons, inputs, tabs (shadcn)
│   ├── hooks/                        # useUser, useEnrollment, useSessions...
│   ├── lib/
│   │   ├── supabase/                 # Client browser + client serveur
│   │   ├── utils.ts                  # Helpers généraux
│   │   └── constants.ts              # Catégories, constantes
│   └── types/
│       ├── database.ts               # Types générés Supabase
│       └── index.ts                  # Types applicatifs
├── supabase/
│   ├── migrations/                   # Scripts SQL dans l'ordre
│   └── seed/                         # Données de démonstration
├── public/                           # Assets statiques
├── .env.local                        # Variables d'environnement (non versionné)
└── package.json
```

---

## Base de Données

### Tables Supabase (PostgreSQL)

| Table | Rôle | Colonnes principales |
|---|---|---|
| `students` | Utilisateurs (élèves ET enseignants) | `id`, `email`, `full_name`, `role`, `level`, `field`, `bio`, `avatar_url`, `onboarded` |
| `sessions` | Cours créés par les enseignants | `id`, `teacher_id`, `title`, `description`, `category`, `thumbnail_url`, `duration_hours`, `is_free` |
| `enrollments` | Inscription d'un élève à un cours | `id`, `student_id`, `session_id`, `status`, `progress`, `submission_url` |
| `lessons` | Leçons vidéo d'un cours | `id`, `session_id`, `title`, `description`, `video_url`, `order_index`, `duration_minutes` |
| `lesson_progress` | Suivi de complétion des leçons | `id`, `student_id`, `lesson_id`, `completed`, `completed_at` |
| `assignments` | Quiz créés par les enseignants | `id`, `session_id`, `title`, `description`, `questions` (JSON), `total_points`, `time_limit_minutes` |
| `assignment_submissions` | Réponses et scores des élèves | `id`, `assignment_id`, `student_id`, `answers` (JSON), `score`, `percentage`, `graded_at` |

### Relations

| Relation | Clé étrangère | Description |
|---|---|---|
| Session → Enseignant | `sessions.teacher_id → students.id` | Chaque cours appartient à un professeur |
| Inscription → Élève | `enrollments.student_id → students.id` | Chaque inscription est liée à un élève |
| Inscription → Session | `enrollments.session_id → sessions.id` | Chaque inscription est liée à un cours |
| Leçon → Session | `lessons.session_id → sessions.id` | Les leçons appartiennent à un cours |
| Progression → Leçon | `lesson_progress.lesson_id → lessons.id` | Suivi par leçon et par élève |
| Quiz → Session | `assignments.session_id → sessions.id` | Les quiz appartiennent à un cours |
| Soumission → Quiz | `assignment_submissions.assignment_id → assignments.id` | Résultats par élève |

### Stockage (Supabase Storage)

| Bucket | Contenu | Accès |
|---|---|---|
| `thumbnails` | Images de couverture des cours (uploadées par l'enseignant) | Public |
| `submissions` | PDFs de devoirs rendus par les élèves | Privé (RLS — élève propriétaire uniquement) |

### Sécurité (Row Level Security)

Toutes les tables sont protégées par des politiques RLS Supabase :

| Règle | Détail |
|---|---|
| Un élève ne voit que ses propres inscriptions | `student_id = auth.uid()` |
| Un enseignant ne gère que ses propres sessions | `teacher_id = auth.uid()` |
| Un élève ne voit que sa propre progression | `student_id = auth.uid()` |
| Les sessions sont lisibles par tous | Politique `SELECT` publique |

---

## Routes API

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/ai-coach` | Envoie un message à Google Gemini 1.5 Flash et retourne la réponse de l'assistant |
| `GET` | `/api/auth/callback` | Gère le redirect OAuth Google après authentification |
| `GET` | `/api/seed` | Injecte les données de démonstration (dev uniquement) |

---

## Pages et Navigation

### Pages Publiques (sans connexion)

| URL | Titre | Contenu |
|---|---|---|
| `/` | Landing Page | Hero 3D, fonctionnalités, statistiques, témoignages, CTA |
| `/sessions` | Catalogue | Grille de tous les cours avec filtres |
| `/teachers/[id]` | Profil enseignant | Bio et sessions publiées d'un professeur |
| `/terms` | CGU | Conditions générales d'utilisation |
| `/privacy` | Confidentialité | Politique de données |
| `/cookies` | Cookies | Politique cookies avec tableau détaillé |

### Pages Protégées (connexion requise)

| URL | Rôle requis | Description |
|---|---|---|
| `/auth` | — | Connexion / inscription |
| `/auth/forgot-password` | — | Demande de réinitialisation du mot de passe |
| `/auth/update-password` | — | Saisie du nouveau mot de passe (lien email Supabase) |
| `/onboarding` | Nouvel utilisateur | Complétion du profil |
| `/dashboard` | Étudiant | Stats, cours inscrits, upload devoir |
| `/profile` | Tout utilisateur | Modifier ses informations |
| `/sessions/[id]` | Tout utilisateur | Détail d'un cours, inscription |
| `/sessions/[id]/learn` | Étudiant inscrit | Redirection vers première leçon |
| `/sessions/[id]/learn/[lessonId]` | Étudiant inscrit | Lecteur vidéo + AI Coach |
| `/sessions/[id]/quiz/[assignmentId]` | Étudiant inscrit | Passer un quiz |
| `/sessions/[id]/quiz/[assignmentId]/results` | Étudiant inscrit | Résultats du quiz |
| `/teacher` | Enseignant | Dashboard — liste ses sessions |
| `/teacher/new` | Enseignant | Créer une nouvelle session |
| `/teacher/sessions/[id]/lessons` | Enseignant propriétaire | Gérer les leçons vidéo |
| `/teacher/sessions/[id]/quiz` | Enseignant propriétaire | Créer / gérer les quiz |

---

## Installation Locale

### Prérequis

| Outil | Version minimale |
|---|---|
| Node.js | 18.x ou supérieur |
| npm | 9.x ou supérieur |
| Compte Supabase | Gratuit — [supabase.com](https://supabase.com) |
| Compte Vercel | Gratuit — [vercel.com](https://vercel.com) (pour le déploiement) |
| Clé API Gemini | Gratuit — [Google AI Studio](https://aistudio.google.com) |

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/islemredouane/Dourous-Net.git
cd dourous-net

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir .env.local avec vos clés (voir section ci-dessous)

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:3000`.

### Variables d'Environnement

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
GEMINI_API_KEY=votre_cle_gemini
```

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → service_role key |
| `GEMINI_API_KEY` | Google AI Studio → Get API Key |

### Configuration Base de Données

Exécuter les scripts SQL dans l'ordre dans l'éditeur SQL de Supabase :

| Ordre | Fichier | Description |
|---|---|---|
| 1 | `supabase/migrations/001_create_tables.sql` | Création de toutes les tables |
| 2 | `supabase/migrations/002_rls_policies.sql` | Politiques de sécurité RLS |
| 3 | `supabase/migrations/003_storage_buckets.sql` | Création des buckets Storage |
| 4 | `supabase/migrations/004_auth_trigger.sql` | Trigger création automatique de profil |
| 5 | `supabase/migrations/006_add_role_field.sql` | Ajout du champ rôle (student/teacher) |
| 6 | `supabase/seed/005_seed_data.sql` | Données de démonstration |
| 7 | `supabase/migrations/007_lessons_assignments.sql` | Tables leçons et quiz |

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile le projet pour la production |
| `npm run start` | Lance le serveur de production |
| `npm run lint` | Vérifie la qualité du code (ESLint) |

---

## Déploiement sur Vercel

1. Importer le dépôt GitHub sur [vercel.com](https://vercel.com)
2. Ajouter les variables d'environnement dans Vercel Dashboard → Settings → Environment Variables
3. Chaque `git push` sur `main` déclenche un redéploiement automatique

**URL de production :** `https://dourous-net-six.vercel.app`

### Configuration Supabase (Auth → URL Configuration)

| Champ | Valeur |
|---|---|
| **Site URL** | `https://dourous-net-six.vercel.app` |
| **Redirect URLs** | `https://dourous-net-six.vercel.app/**` |
| | `https://dourous-net-six.vercel.app/auth/update-password` |
| | `http://localhost:3000/**` |
| | `http://localhost:3000/auth/update-password` |

> La route `/auth/update-password` doit être explicitement autorisée pour que le lien de réinitialisation du mot de passe fonctionne en production.

### Google OAuth

Pour activer la connexion Google :

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activer l'API Google OAuth 2.0
3. Ajouter l'URI de redirection autorisé : `https://bmzntbsmjptlpxxxraxs.supabase.co/auth/v1/callback`
4. Configurer les identifiants dans Supabase Dashboard → Authentication → Providers → Google

---

## Mission 4 — Rapport Architecte

### 1. Mapping du Thème — Dourous-Net (Éducation)

Conformément au **Thème 4** du projet, voici la correspondance exacte entre les tables de notre application et l'architecture imposée :

| Rôle imposé | Table dans Supabase | Description dans Dourous-Net |
|---|---|---|
| **Table A — Utilisateurs** | `students` | Les élèves (et enseignants) — identités gérées via Supabase Auth |
| **Table B — Ressources** | `sessions` | Les séances/cours publiés par les professeurs — éléments consultables par les élèves |
| **Table C — Interactions** | `enrollments` | L'inscription d'un élève à une séance (statut, progression, soumission de devoir) |
| **Fichier (Storage)** | bucket `submissions` | PDF du devoir rendu par l'élève, uploadé dans Supabase Storage |

**Relations clés :**
- `sessions.teacher_id → students.id` : chaque séance appartient à un professeur
- `enrollments.student_id → students.id` : chaque inscription appartient à un élève
- `enrollments.session_id → sessions.id` : chaque inscription est liée à une séance
- Contrainte `UNIQUE(student_id, session_id)` : un élève ne peut s'inscrire qu'une seule fois par séance
- Champ `submission_url` dans `enrollments` : lien vers le fichier PDF soumis dans Storage

**Flux utilisateur complet :**
Inscription/Connexion → Consulter les séances (Table B) → S'inscrire (créer une ligne Table C) → Regarder les leçons → Passer le quiz → Uploader le PDF du devoir (Storage) → Voir son tableau de bord personnel

---

### 2. CAPEX vs. OPEX — Pourquoi Vercel + Supabase ?

**Modèle classique On-Premise (CAPEX) :**
Héberger Dourous-Net sur des serveurs physiques nécessiterait des investissements en capital (CAPEX) considérables : achat de serveurs (~200 000–500 000 DZD), équipements réseau, onduleurs, espace data center climatisé, et une équipe IT dédiée à la maintenance. Le coût total de possession dépasserait facilement 1 000 000 DZD/an pour une plateforme à faible trafic initial, avec un risque élevé si le projet ne décolle pas.

**Notre modèle Cloud (OPEX) :**
En choisissant **Supabase** (PostgreSQL managé + Auth + Storage) et **Vercel** (hébergement serverless), nous transformons la totalité du CAPEX en **OPEX (dépenses opérationnelles)** — nous payons uniquement ce que nous consommons :

| Service | Plan gratuit | Plan payant | Usage Dourous-Net |
|---|---|---|---|
| Supabase | 500 Mo DB, 1 Go Storage, 50 000 users/mois | Pro : $25/mois (8 Go DB, 100 Go Storage) | Gratuit au lancement |
| Vercel | Déploiements illimités, CDN mondial | Pro : $20/mois | Gratuit (phase académique) |
| **Total** | **0 DZD** | **~3 500 DZD/mois à 10 000 utilisateurs** | Démarrage sans capital |

C'est l'avantage fondamental du modèle OPEX : des coûts prévisibles, élastiques, sans engagement initial.

---

### 3. Scalabilité Vercel vs. Data Center Physique

| Critère | Data Center Physique | Vercel (Cloud) |
|---|---|---|
| Latence Algérie | 200–400 ms (serveur unique) | <50 ms (CDN Francfort/Marseille) |
| Mise à l'échelle | Semaines (achat matériel) | Millisecondes (auto-scaling) |
| Coût à faible trafic | Élevé (surprovisionnement permanent) | Nul (scale to zero) |
| CI/CD | Manuel, intervention requise | Automatique à chaque `git push` |
| Disponibilité | Dépend de l'équipe locale | 99.99% SLA Vercel |
| Équipe nécessaire | DevOps + sysadmin dédiés | 0 (binôme d'étudiants suffit) |

**Fonctions Serverless :** Chaque route API Next.js est une fonction serverless isolée — si 500 élèves consultent Dourous-Net simultanément lors d'un examen, la plateforme scale automatiquement puis revient à zéro. Nous ne payons que les millisecondes d'exécution réelles.

---

### 4. Données Structurées vs. Non-Structurées

Dourous-Net utilise **les deux types de stockage** de façon stratégique et complémentaire :

| Type | Technologie | Données stockées | Pourquoi ce choix |
|---|---|---|---|
| **Structuré** | PostgreSQL (Supabase) | `students`, `sessions`, `enrollments`, `lessons`, `assignments` | Relations, contraintes d'intégrité, requêtes JOIN, RLS, transactions ACID |
| **Non-structuré** | Supabase Storage (S3) | PDFs de devoirs, images thumbnail | Taille et format variables, accès CDN, URL sécurisée par RLS Storage |

**Pourquoi PostgreSQL pour les données relationnelles :**
Les politiques **Row Level Security (RLS)** assurent qu'un élève ne voit que ses propres inscriptions, directement au niveau base de données, sans filtrage applicatif. Les requêtes JOIN permettent de récupérer séance + professeur + progression en une seule requête optimisée.

**Pourquoi Storage objet pour les fichiers :**
Les PDFs de devoirs sont des blobs binaires de taille et format variables — impossibles à stocker dans une table relationnelle. Chaque fichier est accessible via une URL CDN sécurisée, et les politiques Storage RLS garantissent que seul l'élève propriétaire peut accéder à son fichier.
