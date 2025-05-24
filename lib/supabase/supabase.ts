import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createClient = () => createClientComponentClient();

export const createServerClient = () => createServerComponentClient({ cookies });

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string,
          email: string,
          full_name: string | null,
          role: "admin" | "manager" | "cashier" | "inventory",
          created_at: string,
          updated_at: string,
        },
        Insert: {
          id: string,
          email: string,
          full_name?: string | null,
          role?: "admin" | "manager" | "cashier" | "inventory",
          created_at?: string,
          updated_at?: string,
        },
        Update: {
          id?: string,
          email?: string,
          full_name?: string | null,
          role?: "admin" | "manager" | "cashier" | "inventory",
          created_at?: string,
          updated_at?: string,
        }
      }
    }
  }
}