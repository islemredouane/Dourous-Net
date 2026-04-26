# Dourous-Net — Algeria's Digital Academy

**ISI 2CP 2026 — Module SI | Theme 4: Education**

> A futuristic, production-grade educational platform built with Next.js 16, Supabase, and Three.js.

**Live URL:** `https://dourous-net.vercel.app`  
**GitHub:** `https://github.com/[your-team]/dourous-net`  
**Test Credentials:** `demo@dourous-net.dz` / `Demo1234!`

---

## Architecture Analysis (Mission 4)

### 1. Table Mapping — Dourous-Net

The three-table schema follows the **Entity-Resource-Interaction** pattern required by the project specification:

| Table | Role | Entities |
|---|---|---|
| `students` | **Table A — Users** | Both learners and teachers; the authentication identity |
| `sessions` | **Table B — Resources** | Educational courses/sessions created by teachers |
| `enrollments` | **Table C — Interactions** | The relationship between a student and a session |

**Relationships:** `sessions.teacher_id → students.id` and `enrollments.student_id → students.id`, `enrollments.session_id → sessions.id`. The `UNIQUE(student_id, session_id)` constraint on enrollments prevents duplicate enrollments. The `enrollments.progress` field (0–100) and `status` field ('enrolled' | 'in_progress' | 'completed') track the lifecycle of each interaction.

### 2. CAPEX vs. OPEX — Cloud Economics

**Traditional On-Premise (CAPEX model):**  
Building this platform on physical servers would require significant Capital Expenditure: purchasing servers (~$5,000–$20,000), networking equipment, storage arrays, UPS systems, and a data center space. Add ongoing maintenance, electricity, and IT staff, and the Total Cost of Ownership easily exceeds $50,000/year for a small-scale platform. Scaling requires purchasing more hardware months in advance — risky when demand is uncertain.

**Dourous-Net Cloud Model (OPEX model):**  
By choosing **Supabase** (managed PostgreSQL + Auth + Storage) and **Vercel** (serverless deployment), we convert all CAPEX to pure OPEX (Operating Expenditure). We pay only for what we consume:

- **Supabase Free Tier**: 500 MB database, 1 GB file storage, 50,000 monthly active users — sufficient to launch and validate the product at zero cost.
- **Supabase Pro ($25/month)**: Unlocks 8 GB database, 100 GB storage, and point-in-time recovery — enough for thousands of daily users.
- **Vercel Free Tier**: Unlimited deployments, global CDN, serverless functions — sufficient for an academic project and early growth stage.
- **Vercel Pro ($20/month)**: Advanced analytics, 1 TB bandwidth, priority support.

Total launch cost: **$0/month**. Total at scale (10,000+ users): **~$45/month**. This is the fundamental advantage of the cloud OPEX model — predictable, elastic costs with no upfront commitment.

### 3. Vercel Scalability

Vercel's infrastructure is purpose-built for Next.js and provides several scalability mechanisms that would be impossible to replicate cheaply on-premise:

**Edge Network (CDN):** Static assets, fonts, and pre-rendered pages are served from 40+ global PoPs (Points of Presence). An Algerian student accessing Dourous-Net gets their HTML from the nearest edge node — Frankfurt or Marseille — in under 50ms, not 200ms from a single Algerian server.

**Serverless Functions:** Every API route and Server Component in Next.js compiles to an isolated serverless function. These auto-scale from 0 to thousands of concurrent instances within milliseconds, with no configuration. A viral session recommendation doesn't bring down the platform — it just spawns more function instances and scales back down when traffic subsides.

**ISR (Incremental Static Regeneration) & Streaming:** With Next.js 16's streaming SSR, the session detail page streams the static shell immediately while the dynamic enrollment status loads in the background. Users see content in under 200ms.

**Zero Ops:** No DevOps engineer needed. Git push → CI/CD pipeline → global deployment in under 2 minutes. Our team of 2 students can ship features without managing infrastructure.

### 4. Structured vs. Unstructured Data

Dourous-Net uses **both types of storage** strategically:

**Structured Data (PostgreSQL via Supabase):**  
`students`, `sessions`, and `enrollments` are relational, structured data with defined schemas, foreign key constraints, and complex queries (JOIN to fetch session + teacher in a single request). PostgreSQL's ACID guarantees ensure that when a student enrolls, the row either commits completely or rolls back — no partial enrollment states. Row-Level Security (RLS) policies at the database layer enforce authorization rules without requiring application-level filtering.

**Unstructured Data (Supabase Storage — S3-compatible):**  
Profile pictures, course thumbnails, and assignment submissions are binary blobs of variable size and format — they cannot be stored in a relational table. Supabase Storage (backed by S3-compatible object storage) handles these perfectly. Files are served via CDN URLs with access controlled by storage RLS policies mirroring the database policies. A student's assignment submission in `submissions/[student_id]/[timestamp].pdf` is only accessible to that student — enforced at the storage layer, not just the application layer.

This dual-storage architecture matches the **right tool to each data type**: structured, queryable data in PostgreSQL; binary blobs in object storage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| 3D | Three.js + React Three Fiber |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # add your Supabase keys
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Database Setup

Run the SQL files in order in the Supabase SQL editor:

1. `supabase/migrations/001_create_tables.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_storage_buckets.sql`
4. `supabase/migrations/004_auth_trigger.sql`

## Team

| Name | Role |
|---|---|
| [Student 1] | Frontend & 3D |
| [Student 2] | Backend & DevOps |
