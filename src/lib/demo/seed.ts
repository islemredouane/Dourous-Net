import type {
  Assignment,
  AssignmentSubmission,
  Enrollment,
  Lesson,
  LessonProgress,
  Session,
  Student,
} from '@/types'

export type DemoRole = 'student' | 'teacher'

export const DEMO_STUDENT_ID = 'd0000001-0000-0000-0000-000000000001'
export const DEMO_TEACHER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const DEMO_PEER_STUDENT_ID = 'd0000002-0000-0000-0000-000000000002'

export const DEMO_ACCOUNTS = {
  student: {
    id: DEMO_STUDENT_ID,
    email: 'yasmine.hadj@estin.dz',
    full_name: 'Yasmine Hadj',
    role: 'student' as const,
    field: 'Computer Science',
    level: 'Intermediate' as const,
    label: 'Student Demo',
    subtitle: 'Dashboard, video player, quizzes & AI Coach',
  },
  teacher: {
    id: DEMO_TEACHER_ID,
    email: 'ahmed.benali@esi.dz',
    full_name: 'Dr. Ahmed Benali',
    role: 'teacher' as const,
    field: 'Computer Science',
    level: 'Advanced' as const,
    label: 'Teacher Studio',
    subtitle: 'Create sessions, lessons, quizzes & grade PDFs',
  },
}

const now = Date.now()
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString()

export interface DemoDatabase {
  version: number
  createdAt: number
  students: Student[]
  sessions: Session[]
  lessons: Lesson[]
  assignments: Assignment[]
  enrollments: Enrollment[]
  lesson_progress: LessonProgress[]
  assignment_submissions: AssignmentSubmission[]
}

export const DEMO_STATE_VERSION = 1

export function createSeedDatabase(): DemoDatabase {
  const students: Student[] = [
    {
      id: DEMO_STUDENT_ID,
      email: 'yasmine.hadj@estin.dz',
      full_name: 'Yasmine Hadj',
      avatar_url: null,
      level: 'Intermediate',
      bio: '2CP Computer Science student at ESTIN exploring algorithms, React architectures, and applied mathematics.',
      created_at: daysAgo(45),
      role: 'student',
      field: 'Computer Science',
      onboarded: true,
    },
    {
      id: DEMO_PEER_STUDENT_ID,
      email: 'amine.khelifi@usthb.dz',
      full_name: 'Amine Khelifi',
      avatar_url: null,
      level: 'Intermediate',
      bio: 'Undergraduate Computer Engineering student focused on systems and data structures.',
      created_at: daysAgo(30),
      role: 'student',
      field: 'Computer Science',
      onboarded: true,
    },
    {
      id: DEMO_TEACHER_ID,
      email: 'ahmed.benali@esi.dz',
      full_name: 'Dr. Ahmed Benali',
      avatar_url: null,
      level: 'Advanced',
      bio: 'PhD in Computer Science specializing in algorithms and cloud architectures. Lecturer at ESI since 2015 and author of distributed systems coursework.',
      created_at: daysAgo(180),
      role: 'teacher',
      field: 'Computer Science',
      onboarded: true,
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      email: 'fatima.hamdi@usthb.dz',
      full_name: 'Prof. Fatima Zohra Hamdi',
      avatar_url: null,
      level: 'Advanced',
      bio: 'Associate Professor in Mathematics and Applied Physics at USTHB with 10+ years teaching engineering analysis and quantum mechanics.',
      created_at: daysAgo(160),
      role: 'teacher',
      field: 'Mathematics & Physics',
      onboarded: true,
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      email: 'youcef.meddah@univ-alger.dz',
      full_name: 'Prof. Youcef Meddah',
      avatar_url: null,
      level: 'Intermediate',
      bio: 'Senior lecturer in Languages, Chemistry & Humanities at University of Algiers. Author of scientific communication handbooks.',
      created_at: daysAgo(140),
      role: 'teacher',
      field: 'Languages & Sciences',
      onboarded: true,
    },
  ]

  const sessions: Session[] = [
    {
      id: 'a0000001-0000-0000-0000-000000000001',
      teacher_id: DEMO_TEACHER_ID,
      title: 'Algorithmes et Structures de Données',
      description:
        'Master core data structures and algorithmic thinking: arrays, linked lists, binary trees, graphs, QuickSort, MergeSort, and Big-O complexity analysis.',
      category: 'Computer Science',
      thumbnail_url: null,
      duration_hours: 24,
      is_free: true,
      created_at: daysAgo(2),
    },
    {
      id: 'a0000001-0000-0000-0000-000000000002',
      teacher_id: DEMO_TEACHER_ID,
      title: 'Développement Web avec React & Next.js',
      description:
        'Build modern full-stack web apps with React 19 and Next.js App Router: Server Components, hooks, Tailwind CSS, and production deployment.',
      category: 'Computer Science',
      thumbnail_url: null,
      duration_hours: 18,
      is_free: true,
      created_at: daysAgo(4),
    },
    {
      id: 'a0000001-0000-0000-0000-000000000003',
      teacher_id: DEMO_TEACHER_ID,
      title: 'Bases de Données et SQL',
      description:
        'From entity-relationship modeling to advanced PostgreSQL queries, indexing, transactions, Row-Level Security, and cloud database tuning.',
      category: 'Computer Science',
      thumbnail_url: null,
      duration_hours: 14,
      is_free: true,
      created_at: daysAgo(7),
    },
    {
      id: 'b0000001-0000-0000-0000-000000000004',
      teacher_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      title: "Algèbre Linéaire pour l'Ingénieur",
      description:
        'Vector spaces, matrix transformations, Gaussian elimination, eigenvalues, diagonalization, and applications in 3D graphics and ML.',
      category: 'Mathematics',
      thumbnail_url: null,
      duration_hours: 20,
      is_free: true,
      created_at: daysAgo(9),
    },
    {
      id: 'b0000001-0000-0000-0000-000000000005',
      teacher_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      title: 'Analyse et Calcul Intégral',
      description:
        'Limits, derivatives, Taylor-Maclaurin series, definite and improper integrals, ODEs, and solved university problem sets.',
      category: 'Mathematics',
      thumbnail_url: null,
      duration_hours: 16,
      is_free: true,
      created_at: daysAgo(12),
    },
    {
      id: 'b0000001-0000-0000-0000-000000000006',
      teacher_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      title: 'Probabilités et Statistiques Appliquées',
      description:
        'Discrete and continuous distributions, central limit theorem, confidence intervals, and hypothesis testing with NumPy & SciPy.',
      category: 'Mathematics',
      thumbnail_url: null,
      duration_hours: 14,
      is_free: true,
      created_at: daysAgo(15),
    },
    {
      id: 'b0000001-0000-0000-0000-000000000007',
      teacher_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      title: 'Introduction à la Physique Quantique',
      description:
        'Wave-particle duality, Schrödinger equation, Heisenberg uncertainty principle, potential wells, lasers, and semiconductor physics.',
      category: 'Physics',
      thumbnail_url: null,
      duration_hours: 12,
      is_free: true,
      created_at: daysAgo(18),
    },
    {
      id: 'c0000001-0000-0000-0000-000000000008',
      teacher_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      title: 'Anglais Technique pour Ingénieurs',
      description:
        'Scientific paper writing, technical presentations, engineering vocabulary, international email communication, and TOEFL/IELTS prep.',
      category: 'Languages',
      thumbnail_url: null,
      duration_hours: 10,
      is_free: true,
      created_at: daysAgo(21),
    },
    {
      id: 'c0000001-0000-0000-0000-000000000009',
      teacher_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      title: "Histoire de l'Algérie Contemporaine",
      description:
        'Critical analysis of Algerian contemporary history from 1962 through state building, institutional reforms, and modern archival sources.',
      category: 'History',
      thumbnail_url: null,
      duration_hours: 8,
      is_free: true,
      created_at: daysAgo(24),
    },
    {
      id: 'c0000001-0000-0000-0000-000000000010',
      teacher_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      title: 'Chimie Organique — Niveau Avancé',
      description:
        'Reaction mechanisms (SN1, SN2, E1, E2), stereochemistry, chirality, and aromatic synthesis with 300+ exam exercises.',
      category: 'Chemistry',
      thumbnail_url: null,
      duration_hours: 18,
      is_free: true,
      created_at: daysAgo(27),
    },
  ]

  const lessons: Lesson[] = [
    {
      id: '10000001-0000-0000-0000-000000000001',
      session_id: 'a0000001-0000-0000-0000-000000000001',
      title: 'Big-O Asymptotic Complexity & Time Analysis',
      description:
        'Understand worst-case vs amortized complexity and how to benchmark recursive and iterative algorithms cleanly.',
      video_url: 'https://www.youtube.com/watch?v=__vX2sjlpXU',
      order_index: 0,
      duration_minutes: 18,
      created_at: daysAgo(2),
    },
    {
      id: '10000001-0000-0000-0000-000000000002',
      session_id: 'a0000001-0000-0000-0000-000000000001',
      title: 'Divide & Conquer: MergeSort and QuickSort',
      description:
        'Visual walkthrough of partitioning, recurrence relations via the Master Theorem, and stability trade-offs.',
      video_url: 'https://www.youtube.com/watch?v=4VqmGXwpLqc',
      order_index: 1,
      duration_minutes: 24,
      created_at: daysAgo(2),
    },
    {
      id: '10000001-0000-0000-0000-000000000003',
      session_id: 'a0000001-0000-0000-0000-000000000001',
      title: 'Trees, Graphs & Shortest-Path Traversal',
      description:
        'Implement BFS, DFS, binary search trees, and Dijkstra priority-queue traversal step by step.',
      video_url: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU',
      order_index: 2,
      duration_minutes: 32,
      created_at: daysAgo(1),
    },
    {
      id: '10000002-0000-0000-0000-000000000001',
      session_id: 'a0000001-0000-0000-0000-000000000002',
      title: 'App Router Architecture & Server Components',
      description:
        'Structure Next.js 16 route groups, layouts, streaming suspense boundaries, and zero-bundle server queries.',
      video_url: 'https://www.youtube.com/watch?v=Sklc_fQBmcs',
      order_index: 0,
      duration_minutes: 22,
      created_at: daysAgo(4),
    },
    {
      id: '10000002-0000-0000-0000-000000000002',
      session_id: 'a0000001-0000-0000-0000-000000000002',
      title: 'State, Hooks & Design System Composition',
      description:
        'Clean client state patterns, Tailwind v4 tokens, and accessible interactive forms.',
      video_url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
      order_index: 1,
      duration_minutes: 26,
      created_at: daysAgo(3),
    },
    {
      id: '10000003-0000-0000-0000-000000000001',
      session_id: 'a0000001-0000-0000-0000-000000000003',
      title: 'Relational Schema Design & PostgreSQL Joins',
      description:
        'Normalize tables cleanly with foreign keys, composite indexes, and analytical SQL aggregations.',
      video_url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
      order_index: 0,
      duration_minutes: 28,
      created_at: daysAgo(6),
    },
    {
      id: '10000004-0000-0000-0000-000000000001',
      session_id: 'b0000001-0000-0000-0000-000000000004',
      title: 'Vectors, Basis & Linear Transformations',
      description:
        'Geometric intuition for linear maps, rank-nullity, and basis changes in Rn.',
      video_url: 'https://www.youtube.com/watch?v=kYB8IZa5AuE',
      order_index: 0,
      duration_minutes: 19,
      created_at: daysAgo(8),
    },
    {
      id: '10000004-0000-0000-0000-000000000002',
      session_id: 'b0000001-0000-0000-0000-000000000004',
      title: 'Eigenvalues, Eigenvectors & Diagonalization',
      description:
        'Solve characteristic polynomials and understand principal axes for engineering dynamics and ML.',
      video_url: 'https://www.youtube.com/watch?v=PFDu9oVAE-g',
      order_index: 1,
      duration_minutes: 21,
      created_at: daysAgo(8),
    },
    {
      id: '10000005-0000-0000-0000-000000000001',
      session_id: 'b0000001-0000-0000-0000-000000000005',
      title: 'Fundamental Theorem of Calculus & Taylor Series',
      description:
        'Bridge derivatives, definite integrals, and local polynomial approximations.',
      video_url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0',
      order_index: 0,
      duration_minutes: 20,
      created_at: daysAgo(11),
    },
    {
      id: '10000007-0000-0000-0000-000000000001',
      session_id: 'b0000001-0000-0000-0000-000000000007',
      title: 'Wave-Particle Duality & Quantum Postulates',
      description:
        'Explore the double-slit experiment, Planck quantization, and state wavefunctions.',
      video_url: 'https://www.youtube.com/watch?v=p7bzE1E5PMY',
      order_index: 0,
      duration_minutes: 25,
      created_at: daysAgo(16),
    },
    {
      id: '10000008-0000-0000-0000-000000000001',
      session_id: 'c0000001-0000-0000-0000-000000000008',
      title: 'Writing Clear Engineering Documentation',
      description:
        'Structure executive summaries, technical abstracts, and design RFCs in concise English.',
      video_url: 'https://www.youtube.com/watch?v=t4vKxsfyBKk',
      order_index: 0,
      duration_minutes: 16,
      created_at: daysAgo(19),
    },
  ]

  const assignments: Assignment[] = [
    {
      id: '20000001-0000-0000-0000-000000000001',
      session_id: 'a0000001-0000-0000-0000-000000000001',
      title: 'Algorithmic Complexity & Sorting Quiz',
      description:
        'Verify your grasp of Big-O bounds, divide-and-conquer recurrences, and graph traversal.',
      questions: [
        {
          id: 'q1',
          question: 'What is the worst-case time complexity of MergeSort on an array of n elements?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
          correct_index: 1,
          points: 2,
          explanation:
            'MergeSort recursively divides the array into two halves (log n levels) and merges n elements per level, yielding O(n log n) in all cases.',
        },
        {
          id: 'q2',
          question: 'Which traversal strategy guarantees finding the shortest unweighted path in a graph?',
          options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Pre-order Tree Walk', 'Topological Sort'],
          correct_index: 1,
          points: 2,
          explanation:
            'BFS explores vertices layer by layer in order of edge distance from the source.',
        },
        {
          id: 'q3',
          question: 'Which data structure gives O(1) amortized push/pop for LIFO access?',
          options: ['Binary Search Tree', 'Adjacency Matrix', 'Stack', 'Min-Heap'],
          correct_index: 2,
          points: 2,
          explanation: 'A stack follows Last-In, First-Out semantics with O(1) push and pop.',
        },
      ],
      total_points: 6,
      time_limit_minutes: 10,
      created_at: daysAgo(2),
    },
    {
      id: '20000002-0000-0000-0000-000000000002',
      session_id: 'a0000001-0000-0000-0000-000000000002',
      title: 'Next.js App Router Architecture Check',
      description: 'Assess your understanding of Server Components, layouts, and Supabase SSR.',
      questions: [
        {
          id: 'nq1',
          question: 'What directive marks a React module as interactive client code in Next.js App Router?',
          options: ["'use server'", "'use client'", "'use browser'", 'export const dynamic'],
          correct_index: 1,
          points: 2,
          explanation: "Placing 'use client' at the top of a file declares the client boundary.",
        },
        {
          id: 'nq2',
          question: 'What is the role of Next.js Route Groups such as (main) and (workspace)?',
          options: [
            'They add the folder name to the public URL path',
            'They partition layouts without altering the URL structure',
            'They disable TypeScript checking inside child files',
            'They expose API endpoints automatically',
          ],
          correct_index: 1,
          points: 3,
          explanation:
            'Parenthesized directories like (main) and (workspace) let different route segments share separate UI chrome without changing URLs.',
        },
      ],
      total_points: 5,
      time_limit_minutes: 8,
      created_at: daysAgo(4),
    },
    {
      id: '20000003-0000-0000-0000-000000000003',
      session_id: 'b0000001-0000-0000-0000-000000000004',
      title: 'Eigenvalues & Matrix Rank Check',
      description: 'Quick checkpoint covering linear independence and matrix diagonalization.',
      questions: [
        {
          id: 'lq1',
          question: 'A square matrix A is invertible if and only if its determinant is:',
          options: ['Zero', 'Non-zero', 'Greater than 1', 'Equal to its trace'],
          correct_index: 1,
          points: 2,
          explanation: 'A non-zero determinant guarantees full rank and linear independence of columns.',
        },
      ],
      total_points: 2,
      time_limit_minutes: 0,
      created_at: daysAgo(8),
    },
  ]

  const enrollments: Enrollment[] = [
    {
      id: '30000001-0000-0000-0000-000000000001',
      student_id: DEMO_STUDENT_ID,
      session_id: 'a0000001-0000-0000-0000-000000000001',
      status: 'in_progress',
      progress: 33,
      submission_url: null,
      enrolled_at: daysAgo(2),
      updated_at: daysAgo(1),
    },
    {
      id: '30000001-0000-0000-0000-000000000002',
      student_id: DEMO_STUDENT_ID,
      session_id: 'a0000001-0000-0000-0000-000000000002',
      status: 'completed',
      progress: 100,
      submission_url: '/api/demo/sample-submission?course=Nextjs-Architecture',
      enrolled_at: daysAgo(5),
      updated_at: daysAgo(2),
    },
    {
      id: '30000001-0000-0000-0000-000000000003',
      student_id: DEMO_STUDENT_ID,
      session_id: 'b0000001-0000-0000-0000-000000000004',
      status: 'enrolled',
      progress: 0,
      submission_url: null,
      enrolled_at: daysAgo(1),
      updated_at: daysAgo(1),
    },
    {
      id: '30000002-0000-0000-0000-000000000004',
      student_id: DEMO_PEER_STUDENT_ID,
      session_id: 'a0000001-0000-0000-0000-000000000001',
      status: 'in_progress',
      progress: 67,
      submission_url: '/api/demo/sample-submission?course=Algorithms-Lab2',
      enrolled_at: daysAgo(3),
      updated_at: daysAgo(0),
    },
  ]

  const lesson_progress: LessonProgress[] = [
    {
      id: '40000001-0000-0000-0000-000000000001',
      student_id: DEMO_STUDENT_ID,
      lesson_id: '10000001-0000-0000-0000-000000000001',
      completed: true,
      completed_at: daysAgo(1),
    },
    {
      id: '40000001-0000-0000-0000-000000000002',
      student_id: DEMO_STUDENT_ID,
      lesson_id: '10000002-0000-0000-0000-000000000001',
      completed: true,
      completed_at: daysAgo(3),
    },
    {
      id: '40000001-0000-0000-0000-000000000003',
      student_id: DEMO_STUDENT_ID,
      lesson_id: '10000002-0000-0000-0000-000000000002',
      completed: true,
      completed_at: daysAgo(2),
    },
  ]

  const assignment_submissions: AssignmentSubmission[] = [
    {
      id: '50000001-0000-0000-0000-000000000001',
      assignment_id: '20000002-0000-0000-0000-000000000002',
      student_id: DEMO_STUDENT_ID,
      answers: [
        { question_id: 'nq1', selected_index: 1 },
        { question_id: 'nq2', selected_index: 1 },
      ],
      score: 5,
      total_points: 5,
      percentage: 100,
      graded_at: daysAgo(2),
    },
  ]

  return {
    version: DEMO_STATE_VERSION,
    createdAt: now,
    students,
    sessions,
    lessons,
    assignments,
    enrollments,
    lesson_progress,
    assignment_submissions,
  }
}
