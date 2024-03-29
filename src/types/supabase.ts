export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hall: {
        Row: {
          created_at: string
          id: string
          name: string | null
          num_students_present: number | null
          scanner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          num_students_present?: number | null
          scanner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          num_students_present?: number | null
          scanner_id?: string | null
        }
        Relationships: []
      }
      lecture: {
        Row: {
          created_at: string
          date: string
          ends_at: string
          hall_id: string
          id: string
          is_ongoing: boolean
          name: string | null
          starts_at: string
        }
        Insert: {
          created_at?: string
          date: string
          ends_at: string
          hall_id: string
          id?: string
          is_ongoing?: boolean
          name?: string | null
          starts_at: string
        }
        Update: {
          created_at?: string
          date?: string
          ends_at?: string
          hall_id?: string
          id?: string
          is_ongoing?: boolean
          name?: string | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lecture_hall_id_fkey"
            columns: ["hall_id"]
            isOneToOne: false
            referencedRelation: "hall"
            referencedColumns: ["id"]
          }
        ]
      }
      lecture_student: {
        Row: {
          created_at: string
          id: string
          is_student_present: boolean
          lecture_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_student_present?: boolean
          lecture_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_student_present?: boolean
          lecture_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lecture_student_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lecture"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lecture_student_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["id"]
          }
        ]
      }
      student: {
        Row: {
          created_at: string
          firstname: string
          id: string
          lastname: string
          nfc_id: string | null
        }
        Insert: {
          created_at?: string
          firstname: string
          id?: string
          lastname: string
          nfc_id?: string | null
        }
        Update: {
          created_at?: string
          firstname?: string
          id?: string
          lastname?: string
          nfc_id?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
