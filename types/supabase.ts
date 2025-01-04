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
      job_applications: {
        Row: {
          id: string
          user_id: string
          company_name: string
          job_url: string
          date_applied: string
          status: 'pending' | 'rejected' | 'accepted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          job_url: string
          date_applied: string
          status: 'pending' | 'rejected' | 'accepted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          job_url?: string
          date_applied?: string
          status?: 'pending' | 'rejected' | 'accepted'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}