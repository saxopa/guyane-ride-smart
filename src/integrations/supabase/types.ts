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
      drivers: {
        Row: {
          created_at: string
          current_latitude: number | null
          current_longitude: number | null
          id: string
          is_verified: boolean | null
          license_number: string | null
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"]
          total_rides: number | null
          updated_at: string
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_plate: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year: number | null
        }
        Insert: {
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          id: string
          is_verified?: boolean | null
          license_number?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_rides?: number | null
          updated_at?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Update: {
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_rides?: number | null
          updated_at?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          payment_method: string
          ride_id: string
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_method: string
          ride_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_method?: string
          ride_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rides: {
        Row: {
          actual_duration: number | null
          completed_at: string | null
          created_at: string
          destination_address: string
          destination_latitude: number
          destination_longitude: number
          distance: number | null
          driver_comment: string | null
          driver_id: string | null
          driver_rating: number | null
          estimated_duration: number | null
          estimated_price: number | null
          final_price: number | null
          id: string
          pickup_address: string
          pickup_latitude: number
          pickup_longitude: number
          rider_comment: string | null
          rider_id: string
          rider_rating: number | null
          status: Database["public"]["Enums"]["ride_status"]
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          actual_duration?: number | null
          completed_at?: string | null
          created_at?: string
          destination_address: string
          destination_latitude: number
          destination_longitude: number
          distance?: number | null
          driver_comment?: string | null
          driver_id?: string | null
          driver_rating?: number | null
          estimated_duration?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          pickup_address: string
          pickup_latitude: number
          pickup_longitude: number
          rider_comment?: string | null
          rider_id: string
          rider_rating?: number | null
          status?: Database["public"]["Enums"]["ride_status"]
          updated_at?: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          actual_duration?: number | null
          completed_at?: string | null
          created_at?: string
          destination_address?: string
          destination_latitude?: number
          destination_longitude?: number
          distance?: number | null
          driver_comment?: string | null
          driver_id?: string | null
          driver_rating?: number | null
          estimated_duration?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          pickup_address?: string
          pickup_latitude?: number
          pickup_longitude?: number
          rider_comment?: string | null
          rider_id?: string
          rider_rating?: number | null
          status?: Database["public"]["Enums"]["ride_status"]
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rider"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          priority: string
          ride_id: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          priority?: string
          ride_id?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          priority?: string
          ride_id?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      driver_status: "offline" | "available" | "busy"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      ride_status:
        | "requested"
        | "accepted"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_role: "rider" | "driver" | "admin"
      vehicle_type: "standard" | "familiale" | "luxe"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      driver_status: ["offline", "available", "busy"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      ride_status: [
        "requested",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_role: ["rider", "driver", "admin"],
      vehicle_type: ["standard", "familiale", "luxe"],
    },
  },
} as const
