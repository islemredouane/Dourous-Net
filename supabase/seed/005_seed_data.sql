-- ============================================================
-- SEED DATA — Dourous-Net demo content
-- Run this in Supabase SQL Editor AFTER migrations 001–004
-- ============================================================

-- Teacher profiles (directly inserted — demo users, no auth counterparts)
INSERT INTO public.students (id, email, full_name, level, bio) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'ahmed.benali@esi.dz',
    'Ahmed Benali',
    'Advanced',
    'Docteur en Informatique, spécialisé en algorithmique et développement web. Enseignant à l''ESI depuis 2015. Auteur de plusieurs articles sur les architectures distribuées et le cloud computing.'
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'fatima.hamdi@usthb.dz',
    'Fatima Zohra Hamdi',
    'Advanced',
    'Maître de conférences en Mathématiques et Physique à l''USTHB. Passionnée par la pédagogie numérique et l''enseignement des sciences fondamentales. 10 ans d''expérience en recherche appliquée.'
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'youcef.meddah@univ-alger.dz',
    'Youcef Meddah',
    'Intermediate',
    'Enseignant en Langues et Histoire à l''Université d''Alger. Auteur de plusieurs ouvrages pédagogiques sur la langue anglaise en milieu scientifique et l''histoire contemporaine.'
  )
ON CONFLICT (id) DO NOTHING;

-- Sessions across all categories
INSERT INTO public.sessions (id, teacher_id, title, description, category, duration_hours, is_free) VALUES
  (
    'a0000001-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Algorithmes et Structures de Données',
    'Maîtrisez les fondements de l''algorithmique moderne : tableaux, listes chaînées, piles, files, arbres binaires et graphes. Ce cours couvre les algorithmes de tri (QuickSort, MergeSort, HeapSort) et de recherche les plus importants, avec analyse de complexité (notation Big-O) et implémentations en Python et C++. Idéal pour préparer les concours d''entrée et les entretiens techniques.',
    'Computer Science', 24, true
  ),
  (
    'a0000001-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Développement Web avec React & Next.js',
    'Construisez des applications web modernes et performantes avec React 18 et Next.js 14. Au programme : composants fonctionnels, hooks avancés (useState, useEffect, useContext, useMemo), App Router, Server Components, Tailwind CSS, gestion d''état avec Zustand, et déploiement sur Vercel. Projet final : une plateforme e-commerce complète.',
    'Computer Science', 18, true
  ),
  (
    'a0000001-0000-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Bases de Données et SQL',
    'De la modélisation entité-association au SQL avancé : création de tables, contraintes, jointures, sous-requêtes, fonctions d''agrégation, transactions et optimisation des requêtes. Introduction aux bases NoSQL (MongoDB) et aux ORM (Prisma). Pratique avec PostgreSQL et Supabase.',
    'Computer Science', 14, true
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Algèbre Linéaire pour l''Ingénieur',
    'Ce cours couvre les espaces vectoriels, les matrices et opérations matricielles, le déterminant, les systèmes d''équations linéaires (méthode de Gauss), les valeurs propres et vecteurs propres, et la diagonalisation. Applications en traitement du signal, graphiques 3D et apprentissage automatique. Exercices corrigés à chaque chapitre.',
    'Mathematics', 20, true
  ),
  (
    'b0000001-0000-0000-0000-000000000005',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Analyse et Calcul Intégral',
    'Du calcul différentiel aux équations différentielles ordinaires : limites et continuité, dérivées et règles de dérivation, séries de Taylor-Maclaurin, intégrales définies et indéfinies, intégration par parties, intégrales multiples et applications physiques. Cours complet avec plus de 200 exercices corrigés et fiches de synthèse.',
    'Mathematics', 16, true
  ),
  (
    'b0000001-0000-0000-0000-000000000006',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Probabilités et Statistiques Appliquées',
    'Variables aléatoires discrètes et continues, lois classiques (Binomiale, Poisson, Normale, Exponentielle), théorème central limite, estimation par intervalle de confiance, tests d''hypothèses (Student, Chi-deux, Fisher). Applications à la data science, au contrôle qualité et à l''ingénierie. Travaux pratiques avec Python (NumPy, SciPy, Pandas).',
    'Mathematics', 14, true
  ),
  (
    'b0000001-0000-0000-0000-000000000007',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Introduction à la Physique Quantique',
    'Les mystères de la mécanique quantique expliqués avec rigueur et pédagogie : postulats de la mécanique quantique, dualité onde-corpuscule, équation de Schrödinger (stationnaire et dépendante du temps), principe d''incertitude d''Heisenberg, puits de potentiel, et introduction à l''atome d''hydrogène. Applications : lasers, semi-conducteurs, IRM.',
    'Physics', 12, true
  ),
  (
    'c0000001-0000-0000-0000-000000000008',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Anglais Technique pour Ingénieurs',
    'Renforcez votre anglais professionnel et scientifique : rédaction de rapports techniques et articles, présentations orales en conférence, vocabulaire spécialisé par domaine (IT, mécanique, électronique, chimie), communication par email en milieu international, et préparation au TOEFL/IELTS. Sessions interactives avec exercices de conversation.',
    'Languages', 10, true
  ),
  (
    'c0000001-0000-0000-0000-000000000009',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Histoire de l''Algérie Contemporaine',
    'De l''indépendance (1962) à nos jours : la construction de l''État algérien, les grandes étapes politiques et économiques, la décennie noire (1990-2000), le Hirak de 2019 et les enjeux actuels. Analyse critique des sources historiques et développement de la pensée analytique. Cours enrichi de documents d''archives et de témoignages.',
    'History', 8, true
  ),
  (
    'c0000001-0000-0000-0000-000000000010',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Chimie Organique — Niveau Avancé',
    'Mécanismes réactionnels en profondeur : substitutions nucléophiles (SN1, SN2), éliminations (E1, E2), additions électrophiles sur alcènes, réactions d''estérification, chimie des aromatiques. Stéréochimie et chiralité. Approche par résolution de problèmes avec plus de 300 exercices progressifs issus d''examens nationaux.',
    'Chemistry', 18, true
  )
ON CONFLICT (id) DO NOTHING;
