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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          doctor_id: string
          duration: number | null
          id: string
          notes: string | null
          patient_id: string
          service: string | null
          status: string
          time: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          doctor_id: string
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          service?: string | null
          status?: string
          time: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          doctor_id?: string
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          service?: string | null
          status?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          created_at: string | null
          date: string
          discount: number | null
          doctor_id: string | null
          id: string
          insurance_coverage: number | null
          items: Json | null
          notes: string | null
          patient_id: string
          patient_responsibility: number | null
          payment_method: string | null
          payment_status: string
          subtotal: number | null
          tax: number | null
          total: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          discount?: number | null
          doctor_id?: string | null
          id?: string
          insurance_coverage?: number | null
          items?: Json | null
          notes?: string | null
          patient_id: string
          patient_responsibility?: number | null
          payment_method?: string | null
          payment_status?: string
          subtotal?: number | null
          tax?: number | null
          total?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          discount?: number | null
          doctor_id?: string | null
          id?: string
          insurance_coverage?: number | null
          items?: Json | null
          notes?: string | null
          patient_id?: string
          patient_responsibility?: number | null
          payment_method?: string | null
          payment_status?: string
          subtotal?: number | null
          tax?: number | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          address: string | null
          availability: Json | null
          department: string | null
          email: string | null
          experience: number | null
          gender: string
          id: string
          joining_date: string | null
          name: string
          phone: string | null
          qualification: string | null
          specialization: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          availability?: Json | null
          department?: string | null
          email?: string | null
          experience?: number | null
          gender: string
          id?: string
          joining_date?: string | null
          name: string
          phone?: string | null
          qualification?: string | null
          specialization?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          availability?: Json | null
          department?: string | null
          email?: string | null
          experience?: number | null
          gender?: string
          id?: string
          joining_date?: string | null
          name?: string
          phone?: string | null
          qualification?: string | null
          specialization?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          blood_type: string | null
          created_by: string | null
          dob: string
          email: string | null
          emergency_contact: Json | null
          gender: string
          id: string
          insurance_details: Json | null
          medical_history: Json | null
          name: string
          phone: string | null
          registered_date: string | null
          status: string
        }
        Insert: {
          address?: string | null
          blood_type?: string | null
          created_by?: string | null
          dob: string
          email?: string | null
          emergency_contact?: Json | null
          gender: string
          id?: string
          insurance_details?: Json | null
          medical_history?: Json | null
          name: string
          phone?: string | null
          registered_date?: string | null
          status?: string
        }
        Update: {
          address?: string | null
          blood_type?: string | null
          created_by?: string | null
          dob?: string
          email?: string | null
          emergency_contact?: Json | null
          gender?: string
          id?: string
          insurance_details?: Json | null
          medical_history?: Json | null
          name?: string
          phone?: string | null
          registered_date?: string | null
          status?: string
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_at: string | null
          date: string
          diagnosis: string | null
          doctor_id: string
          follow_up: Json | null
          id: string
          instructions: string | null
          medications: Json | null
          patient_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          diagnosis?: string | null
          doctor_id: string
          follow_up?: Json | null
          id?: string
          instructions?: string | null
          medications?: Json | null
          patient_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          diagnosis?: string | null
          doctor_id?: string
          follow_up?: Json | null
          id?: string
          instructions?: string | null
          medications?: Json | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "nurse" | "receptionist"
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
      app_role: ["admin", "doctor", "nurse", "receptionist"],
    },
  },
} as const
