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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          event_id: string
          expires_at: string | null
          id: string
          label: Json
          max_uses: number | null
          scope: Database["public"]["Enums"]["access_code_scope"]
          updated_at: string
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          event_id: string
          expires_at?: string | null
          id?: string
          label?: Json
          max_uses?: number | null
          scope?: Database["public"]["Enums"]["access_code_scope"]
          updated_at?: string
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          event_id?: string
          expires_at?: string | null
          id?: string
          label?: Json
          max_uses?: number | null
          scope?: Database["public"]["Enums"]["access_code_scope"]
          updated_at?: string
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_days: {
        Row: {
          created_at: string
          date: string
          event_id: string
          id: string
          label: Json
          position: number
          speaker_external_ids: Json
          topic_slugs: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          event_id: string
          id?: string
          label?: Json
          position: number
          speaker_external_ids?: Json
          topic_slugs?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          event_id?: string
          id?: string
          label?: Json
          position?: number
          speaker_external_ids?: Json
          topic_slugs?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_days_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_sessions: {
        Row: {
          created_at: string
          day_id: string
          description: Json
          event_id: string
          id: string
          location: Json
          position: number
          tag: string | null
          time_text: string
          title: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_id: string
          description?: Json
          event_id: string
          id?: string
          location?: Json
          position?: number
          tag?: string | null
          time_text: string
          title?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_id?: string
          description?: Json
          event_id?: string
          id?: string
          location?: Json
          position?: number
          tag?: string | null
          time_text?: string
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_sessions_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "agenda_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          access_code: string | null
          check_in: string | null
          check_out: string | null
          created_at: string
          email: string
          event_id: string
          full_name: string
          guests: number | null
          hotel_id: string | null
          hotel_name: string | null
          id: string
          notes: string | null
          organization: string | null
          phone: string | null
          raw: Json
          room_type: string | null
          rooms: number | null
          status: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          email: string
          event_id: string
          full_name: string
          guests?: number | null
          hotel_id?: string | null
          hotel_name?: string | null
          id?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          raw?: Json
          room_type?: string | null
          rooms?: number | null
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          guests?: number | null
          hotel_id?: string | null
          hotel_name?: string | null
          id?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          raw?: Json
          room_type?: string | null
          rooms?: number | null
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: Json
          event_id: string
          file_size: string | null
          file_type: string | null
          file_url: string | null
          id: string
          name: Json
          position: number
          requires_code: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: Json
          event_id: string
          file_size?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          name?: Json
          position?: number
          requires_code?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: Json
          event_id?: string
          file_size?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          name?: Json
          position?: number
          requires_code?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_settings: {
        Row: {
          booking_enabled: boolean
          contact: Json
          created_at: string
          documents_locked: boolean
          event_id: string
          footer_text: Json
          id: string
          library_locked: boolean
          registration_enabled: boolean
          seo: Json
          social_links: Json
          updated_at: string
        }
        Insert: {
          booking_enabled?: boolean
          contact?: Json
          created_at?: string
          documents_locked?: boolean
          event_id: string
          footer_text?: Json
          id?: string
          library_locked?: boolean
          registration_enabled?: boolean
          seo?: Json
          social_links?: Json
          updated_at?: string
        }
        Update: {
          booking_enabled?: boolean
          contact?: Json
          created_at?: string
          documents_locked?: boolean
          event_id?: string
          footer_text?: Json
          id?: string
          library_locked?: boolean
          registration_enabled?: boolean
          seo?: Json
          social_links?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_url: string | null
          created_at: string
          default_lang: string
          end_at: string | null
          id: string
          is_default: boolean
          location: Json
          logo_url: string | null
          name: Json
          slug: string
          start_at: string | null
          status: string
          tagline: Json
          theme: Json
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          default_lang?: string
          end_at?: string | null
          id?: string
          is_default?: boolean
          location?: Json
          logo_url?: string | null
          name?: Json
          slug: string
          start_at?: string | null
          status?: string
          tagline?: Json
          theme?: Json
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          default_lang?: string
          end_at?: string | null
          id?: string
          is_default?: boolean
          location?: Json
          logo_url?: string | null
          name?: Json
          slug?: string
          start_at?: string | null
          status?: string
          tagline?: Json
          theme?: Json
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: Json
          category: Json
          created_at: string
          event_id: string
          id: string
          position: number
          question: Json
          updated_at: string
        }
        Insert: {
          answer?: Json
          category?: Json
          created_at?: string
          event_id: string
          id?: string
          position?: number
          question?: Json
          updated_at?: string
        }
        Update: {
          answer?: Json
          category?: Json
          created_at?: string
          event_id?: string
          id?: string
          position?: number
          question?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_content: {
        Row: {
          background_url: string | null
          countdown_to: string | null
          created_at: string
          cta_agenda_label: Json
          cta_register_label: Json
          date_text: Json
          event_id: string
          id: string
          lead: Json
          location_text: Json
          tagline: Json
          updated_at: string
        }
        Insert: {
          background_url?: string | null
          countdown_to?: string | null
          created_at?: string
          cta_agenda_label?: Json
          cta_register_label?: Json
          date_text?: Json
          event_id: string
          id?: string
          lead?: Json
          location_text?: Json
          tagline?: Json
          updated_at?: string
        }
        Update: {
          background_url?: string | null
          countdown_to?: string | null
          created_at?: string
          cta_agenda_label?: Json
          cta_register_label?: Json
          date_text?: Json
          event_id?: string
          id?: string
          lead?: Json
          location_text?: Json
          tagline?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hero_content_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: Json
          contact: Json
          created_at: string
          description: Json
          event_id: string
          external_id: string | null
          id: string
          images: Json
          map_url: string | null
          name: string
          perks: Json
          position: number
          tier: Json
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: Json
          contact?: Json
          created_at?: string
          description?: Json
          event_id: string
          external_id?: string | null
          id?: string
          images?: Json
          map_url?: string | null
          name: string
          perks?: Json
          position?: number
          tier?: Json
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: Json
          contact?: Json
          created_at?: string
          description?: Json
          event_id?: string
          external_id?: string | null
          id?: string
          images?: Json
          map_url?: string | null
          name?: string
          perks?: Json
          position?: number
          tier?: Json
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotels_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      key_contents: {
        Row: {
          body: Json
          created_at: string
          event_id: string
          id: string
          image_url: string | null
          position: number
          title: Json
          updated_at: string
        }
        Insert: {
          body?: Json
          created_at?: string
          event_id: string
          id?: string
          image_url?: string | null
          position?: number
          title?: Json
          updated_at?: string
        }
        Update: {
          body?: Json
          created_at?: string
          event_id?: string
          id?: string
          image_url?: string | null
          position?: number
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_contents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      library_items: {
        Row: {
          created_at: string
          day_index: number | null
          event_id: string
          external_id: string | null
          id: string
          position: number
          requires_code: boolean
          source_url: string
          thumbnail_url: string
          title: Json
          type: Database["public"]["Enums"]["library_media_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_index?: number | null
          event_id: string
          external_id?: string | null
          id?: string
          position?: number
          requires_code?: boolean
          source_url: string
          thumbnail_url: string
          title?: Json
          type: Database["public"]["Enums"]["library_media_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_index?: number | null
          event_id?: string
          external_id?: string | null
          id?: string
          position?: number
          requires_code?: boolean
          source_url?: string
          thumbnail_url?: string
          title?: Json
          type?: Database["public"]["Enums"]["library_media_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string | null
          body: Json
          cover_url: string | null
          created_at: string
          event_id: string
          excerpt: Json
          id: string
          position: number
          published_at: string | null
          read_time: string | null
          slug: string
          tag: string | null
          title: Json
          updated_at: string
        }
        Insert: {
          author?: string | null
          body?: Json
          cover_url?: string | null
          created_at?: string
          event_id: string
          excerpt?: Json
          id?: string
          position?: number
          published_at?: string | null
          read_time?: string | null
          slug: string
          tag?: string | null
          title?: Json
          updated_at?: string
        }
        Update: {
          author?: string | null
          body?: Json
          cover_url?: string | null
          created_at?: string
          event_id?: string
          excerpt?: Json
          id?: string
          position?: number
          published_at?: string | null
          read_time?: string | null
          slug?: string
          tag?: string | null
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      overview_content: {
        Row: {
          created_at: string
          event_id: string
          eyebrow: Json
          highlights: Json
          id: string
          lead: Json
          orgs: Json
          orgs_title: Json
          title: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          eyebrow?: Json
          highlights?: Json
          id?: string
          lead?: Json
          orgs?: Json
          orgs_title?: Json
          title?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          eyebrow?: Json
          highlights?: Json
          id?: string
          lead?: Json
          orgs?: Json
          orgs_title?: Json
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "overview_content_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      press_releases: {
        Row: {
          created_at: string
          description: Json
          event_id: string
          file_url: string | null
          id: string
          position: number
          published_at: string | null
          source: string | null
          title: Json
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: Json
          event_id: string
          file_url?: string | null
          id?: string
          position?: number
          published_at?: string | null
          source?: string | null
          title?: Json
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: Json
          event_id?: string
          file_url?: string | null
          id?: string
          position?: number
          published_at?: string | null
          source?: string | null
          title?: Json
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "press_releases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          access_code: string | null
          country_code: string | null
          created_at: string
          customer_type: string | null
          email: string
          event_id: string
          full_name: string
          id: string
          job_title: string | null
          language: string | null
          nationality: string | null
          notes: string | null
          organization: string | null
          passport_url: string | null
          phone: string | null
          raw: Json
          submitted_at: string
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          country_code?: string | null
          created_at?: string
          customer_type?: string | null
          email: string
          event_id: string
          full_name: string
          id?: string
          job_title?: string | null
          language?: string | null
          nationality?: string | null
          notes?: string | null
          organization?: string | null
          passport_url?: string | null
          phone?: string | null
          raw?: Json
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          country_code?: string | null
          created_at?: string
          customer_type?: string | null
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          job_title?: string | null
          language?: string | null
          nationality?: string | null
          notes?: string | null
          organization?: string | null
          passport_url?: string | null
          phone?: string | null
          raw?: Json
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      speakers: {
        Row: {
          avatar_url: string | null
          bio: Json
          created_at: string
          event_id: string
          external_id: string | null
          full_name: string
          honorific: string | null
          id: string
          organization: Json
          position: number
          role: Json
          socials: Json
          topic_slugs: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: Json
          created_at?: string
          event_id: string
          external_id?: string | null
          full_name: string
          honorific?: string | null
          id?: string
          organization?: Json
          position?: number
          role?: Json
          socials?: Json
          topic_slugs?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: Json
          created_at?: string
          event_id?: string
          external_id?: string | null
          full_name?: string
          honorific?: string | null
          id?: string
          organization?: Json
          position?: number
          role?: Json
          socials?: Json
          topic_slugs?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "speakers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string
          event_id: string
          id: string
          logo_url: string | null
          name: string
          position: number
          tier: Database["public"]["Enums"]["sponsor_tier"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          logo_url?: string | null
          name: string
          position?: number
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          logo_url?: string | null
          name?: string
          position?: number
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          abbr: string | null
          content_blocks: Json
          created_at: string
          documents: Json
          event_id: string
          highlights: Json
          id: string
          image_url: string | null
          long_description: Json
          position: number
          slug: string
          summary: Json
          title: Json
          updated_at: string
        }
        Insert: {
          abbr?: string | null
          content_blocks?: Json
          created_at?: string
          documents?: Json
          event_id: string
          highlights?: Json
          id?: string
          image_url?: string | null
          long_description?: Json
          position?: number
          slug: string
          summary?: Json
          title?: Json
          updated_at?: string
        }
        Update: {
          abbr?: string | null
          content_blocks?: Json
          created_at?: string
          documents?: Json
          event_id?: string
          highlights?: Json
          id?: string
          image_url?: string | null
          long_description?: Json
          position?: number
          slug?: string
          summary?: Json
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      why_attend_items: {
        Row: {
          created_at: string
          description: Json
          event_id: string
          icon: string | null
          id: string
          position: number
          stat: string | null
          stat_label: Json
          title: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: Json
          event_id: string
          icon?: string | null
          id?: string
          position?: number
          stat?: string | null
          stat_label?: Json
          title?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: Json
          event_id?: string
          icon?: string | null
          id?: string
          position?: number
          stat?: string | null
          stat_label?: Json
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "why_attend_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_event: {
        Args: { _event_id: string; _user_id: string }
        Returns: boolean
      }
      event_is_published: { Args: { _event_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _event_id?: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      access_code_scope: "all" | "registration" | "library" | "document"
      app_role: "super_admin" | "event_admin" | "editor"
      library_media_type: "photo" | "video"
      sponsor_tier:
        | "diamond"
        | "platinum"
        | "gold"
        | "silver"
        | "bronze"
        | "partner"
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
      access_code_scope: ["all", "registration", "library", "document"],
      app_role: ["super_admin", "event_admin", "editor"],
      library_media_type: ["photo", "video"],
      sponsor_tier: [
        "diamond",
        "platinum",
        "gold",
        "silver",
        "bronze",
        "partner",
      ],
    },
  },
} as const
