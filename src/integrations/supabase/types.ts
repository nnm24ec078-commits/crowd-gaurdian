export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          ai_reasoning: string | null
          area_id: string
          assignment_priority: Database["public"]["Enums"]["priority_level"]
          created_at: string
          id: string
          officer_id: string | null
          officers_assigned: number | null
          officers_required: number
          status: string
          updated_at: string
        }
        Insert: {
          ai_reasoning?: string | null
          area_id: string
          assignment_priority: Database["public"]["Enums"]["priority_level"]
          created_at?: string
          id?: string
          officer_id?: string | null
          officers_assigned?: number | null
          officers_required: number
          status?: string
          updated_at?: string
        }
        Update: {
          ai_reasoning?: string | null
          area_id?: string
          assignment_priority?: Database["public"]["Enums"]["priority_level"]
          created_at?: string
          id?: string
          officer_id?: string | null
          officers_assigned?: number | null
          officers_required?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "crowd_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "police_officers"
            referencedColumns: ["id"]
          },
        ]
      }
      crowd_areas: {
        Row: {
          camera_id: string | null
          created_at: string
          crowd_density: number
          estimated_count: number | null
          id: string
          location_lat: number
          location_lng: number
          name: string
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["area_status"]
          thermal_reading: number | null
          updated_at: string
        }
        Insert: {
          camera_id?: string | null
          created_at?: string
          crowd_density: number
          estimated_count?: number | null
          id?: string
          location_lat: number
          location_lng: number
          name: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["area_status"]
          thermal_reading?: number | null
          updated_at?: string
        }
        Update: {
          camera_id?: string | null
          created_at?: string
          crowd_density?: number
          estimated_count?: number | null
          id?: string
          location_lat?: number
          location_lng?: number
          name?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["area_status"]
          thermal_reading?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      police_officers: {
        Row: {
          contact_number: string | null
          created_at: string
          current_location_lat: number | null
          current_location_lng: number | null
          id: string
          officer_id: string
          officer_name: string
          status: Database["public"]["Enums"]["officer_status"]
          updated_at: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          current_location_lat?: number | null
          current_location_lng?: number | null
          id?: string
          officer_id: string
          officer_name: string
          status?: Database["public"]["Enums"]["officer_status"]
          updated_at?: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          current_location_lat?: number | null
          current_location_lng?: number | null
          id?: string
          officer_id?: string
          officer_name?: string
          status?: Database["public"]["Enums"]["officer_status"]
          updated_at?: string
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
      area_status: "normal" | "monitoring" | "alert" | "emergency"
      officer_status: "available" | "assigned" | "on_duty" | "off_duty"
      priority_level: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      area_status: ["normal", "monitoring", "alert", "emergency"],
      officer_status: ["available", "assigned", "on_duty", "off_duty"],
      priority_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
