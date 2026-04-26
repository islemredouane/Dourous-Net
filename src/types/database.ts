export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          level: 'Beginner' | 'Intermediate' | 'Advanced'
          bio: string | null
          created_at: string
          role: 'student' | 'teacher'
          field: string | null
          onboarded: boolean
        }
        Insert: {
          id?: string
          email: string
          full_name?: string
          avatar_url?: string | null
          level?: 'Beginner' | 'Intermediate' | 'Advanced'
          bio?: string | null
          created_at?: string
          role?: 'student' | 'teacher'
          field?: string | null
          onboarded?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          level?: 'Beginner' | 'Intermediate' | 'Advanced'
          bio?: string | null
          created_at?: string
          role?: 'student' | 'teacher'
          field?: string | null
          onboarded?: boolean
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          teacher_id: string
          title: string
          description: string | null
          category: string
          thumbnail_url: string | null
          duration_hours: number
          is_free: boolean
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          title: string
          description?: string | null
          category?: string
          thumbnail_url?: string | null
          duration_hours?: number
          is_free?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          title?: string
          description?: string | null
          category?: string
          thumbnail_url?: string | null
          duration_hours?: number
          is_free?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sessions_teacher_id_fkey'
            columns: ['teacher_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          session_id: string
          status: 'enrolled' | 'in_progress' | 'completed'
          progress: number
          submission_url: string | null
          enrolled_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          session_id: string
          status?: 'enrolled' | 'in_progress' | 'completed'
          progress?: number
          submission_url?: string | null
          enrolled_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          session_id?: string
          status?: 'enrolled' | 'in_progress' | 'completed'
          progress?: number
          submission_url?: string | null
          enrolled_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'enrollments_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollments_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          }
        ]
      }
      lessons: {
        Row: {
          id: string
          session_id: string
          title: string
          description: string | null
          video_url: string | null
          order_index: number
          duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          title: string
          description?: string | null
          video_url?: string | null
          order_index?: number
          duration_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          order_index?: number
          duration_minutes?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lessons_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          }
        ]
      }
      lesson_progress: {
        Row: {
          id: string
          student_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          }
        ]
      }
      assignments: {
        Row: {
          id: string
          session_id: string
          title: string
          description: string | null
          questions: Json
          total_points: number
          time_limit_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          title: string
          description?: string | null
          questions?: Json
          total_points?: number
          time_limit_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          title?: string
          description?: string | null
          questions?: Json
          total_points?: number
          time_limit_minutes?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assignments_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          }
        ]
      }
      assignment_submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          answers: Json
          score: number
          total_points: number
          percentage: number
          graded_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          answers?: Json
          score?: number
          total_points?: number
          percentage?: number
          graded_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          answers?: Json
          score?: number
          total_points?: number
          percentage?: number
          graded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assignment_submissions_assignment_id_fkey'
            columns: ['assignment_id']
            isOneToOne: false
            referencedRelation: 'assignments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assignment_submissions_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
