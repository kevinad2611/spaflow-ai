export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StaffRole = "manager" | "technician" | "receptionist";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";
export type PlatformType =
  | "zalo_oa"
  | "email"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "website";
export type AutomationTriggerType =
  | "before_24h"
  | "before_2h"
  | "after_completed_24h";
export type AutomationChannel = "zalo" | "email" | "both";
export type MessageChannel = "zalo" | "email";
export type MessageStatus = "sent" | "failed";
export type AiPlatformType =
  | "facebook"
  | "zalo"
  | "tiktok"
  | "youtube"
  | "website";

export interface Database {
  public: {
    Tables: {
      spas: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          phone: string;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          phone: string;
          address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          phone?: string;
          address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      staff: {
        Row: {
          id: string;
          spa_id: string;
          full_name: string;
          phone: string | null;
          role: StaffRole;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          spa_id: string;
          full_name: string;
          phone?: string | null;
          role?: StaffRole;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          spa_id?: string;
          full_name?: string;
          phone?: string | null;
          role?: StaffRole;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          spa_id: string;
          full_name: string;
          phone: string;
          zalo_phone: string | null;
          email: string | null;
          address: string | null;
          notes: string | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          spa_id: string;
          full_name: string;
          phone: string;
          zalo_phone?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          spa_id?: string;
          full_name?: string;
          phone?: string;
          zalo_phone?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          spa_id: string;
          name: string;
          category: string;
          price: number;
          duration_minutes: number;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          spa_id: string;
          name: string;
          category?: string;
          price?: number;
          duration_minutes?: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          spa_id?: string;
          name?: string;
          category?: string;
          price?: number;
          duration_minutes?: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: {
          id: string;
          spa_id: string;
          customer_id: string;
          staff_id: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status: AppointmentStatus;
          total_price: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          spa_id: string;
          customer_id: string;
          staff_id?: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status?: AppointmentStatus;
          total_price?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          spa_id?: string;
          customer_id?: string;
          staff_id?: string | null;
          appointment_date?: string;
          start_time?: string;
          end_time?: string;
          status?: AppointmentStatus;
          total_price?: number;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      appointment_services: {
        Row: {
          id: string;
          appointment_id: string;
          service_id: string;
          price_at_booking: number;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          service_id: string;
          price_at_booking: number;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          service_id?: string;
          price_at_booking?: number;
        };
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      platform_connections: {
        Row: {
          id: string;
          spa_id: string;
          platform: PlatformType;
          is_connected: boolean;
          credentials_encrypted: string | null;
          profile_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          spa_id: string;
          platform: PlatformType;
          is_connected?: boolean;
          credentials_encrypted?: string | null;
          profile_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          spa_id?: string;
          platform?: PlatformType;
          is_connected?: boolean;
          credentials_encrypted?: string | null;
          profile_url?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "platform_connections_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
        ];
      };
      automation_rules: {
        Row: {
          id: string;
          spa_id: string;
          trigger_type: AutomationTriggerType;
          channel: AutomationChannel;
          template_content: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          spa_id: string;
          trigger_type: AutomationTriggerType;
          channel?: AutomationChannel;
          template_content: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          spa_id?: string;
          trigger_type?: AutomationTriggerType;
          channel?: AutomationChannel;
          template_content?: string;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "automation_rules_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
        ];
      };
      message_logs: {
        Row: {
          id: string;
          spa_id: string;
          appointment_id: string;
          customer_id: string;
          rule_id: string | null;
          channel: MessageChannel;
          status: MessageStatus;
          error_message: string | null;
          sent_at: string;
        };
        Insert: {
          id?: string;
          spa_id: string;
          appointment_id: string;
          customer_id: string;
          rule_id?: string | null;
          channel: MessageChannel;
          status: MessageStatus;
          error_message?: string | null;
          sent_at?: string;
        };
        Update: {
          id?: string;
          spa_id?: string;
          appointment_id?: string;
          customer_id?: string;
          rule_id?: string | null;
          channel?: MessageChannel;
          status?: MessageStatus;
          error_message?: string | null;
          sent_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_logs_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_logs_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_logs_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_logs_rule_id_fkey";
            columns: ["rule_id"];
            isOneToOne: false;
            referencedRelation: "automation_rules";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_contents: {
        Row: {
          id: string;
          spa_id: string;
          service_id: string | null;
          platform: AiPlatformType;
          title: string;
          content: string;
          video_script: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          spa_id: string;
          service_id?: string | null;
          platform: AiPlatformType;
          title: string;
          content: string;
          video_script?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          spa_id?: string;
          service_id?: string | null;
          platform?: AiPlatformType;
          title?: string;
          content?: string;
          video_script?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_contents_spa_id_fkey";
            columns: ["spa_id"];
            isOneToOne: false;
            referencedRelation: "spas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_contents_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
