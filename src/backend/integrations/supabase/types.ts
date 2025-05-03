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
      food_listings: {
        Row: {
          category: string | null
          contact_info: Json | null
          cuisine: string[] | null
          description: string | null
          id: string
          images: string[] | null
          is_available: boolean | null
          location: string | null
          name: string | null
          owner_id: string | null
          price: number | null
          rating: number | null
          type: string | null
        }
        Insert: {
          category?: string | null
          contact_info?: Json | null
          cuisine?: string[] | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          location?: string | null
          name?: string | null
          owner_id?: string | null
          price?: number | null
          rating?: number | null
          type?: string | null
        }
        Update: {
          category?: string | null
          contact_info?: Json | null
          cuisine?: string[] | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          location?: string | null
          name?: string | null
          owner_id?: string | null
          price?: number | null
          rating?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_listings_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          food_provider_id: string | null
          id: string
          is_from_provider: boolean | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          food_provider_id?: string | null
          id?: string
          is_from_provider?: boolean | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          food_provider_id?: string | null
          id?: string
          is_from_provider?: boolean | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_food_provider_id_fkey"
            columns: ["food_provider_id"]
            referencedRelation: "food_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          food_provider_id: string | null
          id: string
          rating: number | null
          user_id: string | null
          user_image: string | null
          user_name: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          food_provider_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
          user_image?: string | null
          user_name?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          food_provider_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
          user_image?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_food_provider_id_fkey"
            columns: ["food_provider_id"]
            referencedRelation: "food_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
