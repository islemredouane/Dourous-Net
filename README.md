# Dourous-Net — Algeria's Digital Academy

**ISI 2CP 2026 — Module SI | Thème 4 : Éducation**

> Plateforme éducative algérienne de nouvelle génération — Next.js 16, Supabase, Three.js.

**Live URL:** https://dourous-net-six.vercel.app    
**GitHub:** https://github.com/islemredouane/Dourous-Net  
**Identifiants de test :** `demo@dourous-net.dz` / `Demo1234!`

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
Inscription/Connexion → Consulter les séances (Table B) → S'inscrire (créer une ligne Table C) → Uploader le PDF du devoir (Storage) → Voir son tableau de bord personnel

---

### 2. CAPEX vs. OPEX — Pourquoi Vercel + Supabase ?

**Modèle classique On-Premise (CAPEX) :**  
Héberger Dourous-Net sur des serveurs physiques nécessiterait des investissements en capital (CAPEX) considérables : achat de serveurs (~200 000–500 000 DZD), équipements réseau, onduleurs, espace data center climatisé, et une équipe IT dédiée à la maintenance. Le coût total de possession dépasserait facilement 1 000 000 DZD/an pour une plateforme à faible trafic initial, avec un risque élevé si le projet ne décolle pas.

**Notre modèle Cloud (OPEX) :**  
En choisissant **Supabase** (PostgreSQL managé + Auth + Storage) et **Vercel** (hébergement serverless), nous transformons la totalité du CAPEX en **OPEX (dépenses opérationnelles)** — nous payons uniquement ce que nous consommons :

- **Supabase gratuit** : 500 Mo de base, 1 Go de fichiers, 50 000 utilisateurs/mois → coût = 0 DZD pour lancer le projet
- **Supabase Pro ($25/mois)** : 8 Go de base, 100 Go de stockage → suffisant pour des milliers d'utilisateurs journaliers
- **Vercel gratuit** : déploiements illimités, CDN mondial, fonctions serverless → suffisant pour la phase académique
- **Coût total au lancement : 0 DZD. À 10 000 utilisateurs actifs : ~3 500 DZD/mois.**

C'est l'avantage fondamental du modèle OPEX : des coûts prévisibles, élastiques, sans engagement initial. Un binôme d'étudiants peut lancer une plateforme mondiale sans capital de départ.

---

### 3. Scalabilité Vercel vs. Data Center Physique

Un data center physique local en Algérie imposerait des contraintes structurelles : climatisation coûteuse (~30–40% du budget électrique), serveurs rack dimensionnés pour le pic maximal (surprovisionnement permanent), délais de plusieurs semaines pour ajouter de la capacité, et une équipe de maintenance 24/7.

Vercel résout ces problèmes structurellement :

**Edge Network (CDN mondial) :** Les pages statiques et assets de Dourous-Net sont distribués depuis 40+ Points de Présence (PoP) mondiaux. Un étudiant algérien accède au contenu depuis le nœud le plus proche (Francfort ou Marseille) en moins de 50 ms, contre 200–400 ms depuis un serveur unique en Algérie.

**Fonctions Serverless auto-scalables :** Chaque route API et Server Component Next.js est compilé en une fonction serverless isolée. Ces fonctions s'exécutent de 0 à des milliers d'instances concurrentes en quelques millisecondes, sans configuration. Si 500 élèves consultent Dourous-Net simultanément lors d'un examen, la plateforme scale automatiquement puis revient à zéro — nous ne payons que les millisecondes d'exécution réelles.

**CI/CD automatique :** Chaque `git push` déclenche un rebuild et un redéploiement mondial en moins de 2 minutes. Zéro intervention manuelle, zéro downtime, zéro ingénieur DevOps requis pour un binôme d'étudiants.

---

### 4. Données Structurées vs. Non-Structurées

Dourous-Net utilise **les deux types de stockage** de façon stratégique et complémentaire :

**Données structurées (PostgreSQL via Supabase) :**  
Les tables `students`, `sessions` et `enrollments` sont des données relationnelles avec schémas définis, clés étrangères et contraintes d'intégrité. PostgreSQL garantit que chaque inscription (Table C) est atomique (ACID) — elle valide complètement ou annule, sans état partiel. Les politiques **Row Level Security (RLS)** assurent qu'un élève ne voit que ses propres inscriptions, directement au niveau base de données, sans filtrage applicatif. Les requêtes JOIN permettent de récupérer séance + professeur en une seule requête optimisée.

**Données non-structurées (Supabase Storage) :**  
Les PDFs de devoirs rendus par les élèves sont des blobs binaires de taille et format variables — impossibles à stocker dans une table relationnelle. Supabase Storage (compatible S3) les gère dans le bucket `submissions`. Chaque fichier est accessible via une URL CDN sécurisée, et les politiques de Storage RLS garantissent que seul l'élève propriétaire peut accéder à son fichier. Cette architecture **donne à chaque type de donnée l'outil adapté** : PostgreSQL pour le structuré requêtable, Storage objet pour les binaires variables.

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| 3D | Three.js + React Three Fiber |
| Animation | Framer Motion |
| Base de données | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + Google OAuth) |
| Storage | Supabase Storage |
| AI | Google Gemini 1.5 Flash (AI Coach) |
| Déploiement | Vercel (CI/CD) |

## Lancer le projet localement

```bash
npm install
# Créer .env.local avec vos clés Supabase
npm run dev
```

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GEMINI_API_KEY=...
```

## Configuration base de données

Exécuter dans l'ordre dans l'éditeur SQL Supabase :

1. `supabase/migrations/001_create_tables.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_storage_buckets.sql`
4. `supabase/migrations/004_auth_trigger.sql`
5. `supabase/migrations/006_add_role_field.sql`
6. `supabase/seed/005_seed_data.sql`
7. `supabase/migrations/007_lessons_assignments.sql`

## Équipe

| Nom & Prénom | Rôle |
|---|---|
| Redouane Mohamed Islem | Frontend, 3D |
| Boukhanouf Abdelhak | Architectur, Backend |
| Zin Mohamed Khalil | DevOps |
