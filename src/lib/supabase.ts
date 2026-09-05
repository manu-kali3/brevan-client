import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function createClient() {
  if (!url || !anonKey) throw new Error("Missing Supabase env");
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });
}

export function createAdminClient() {
  if (!url || !serviceRoleKey) return null;
  return createSupabaseJsClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

export const supabase = createAdminClient();
export const supabaseAdmin = supabase;

export interface LeadInput {
  type: "quote" | "contact";
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  service?: string;
  message?: string;
}

export async function storeLead(input: LeadInput): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("leads").insert([input]);
  if (error) {
    console.error("Supabase insert error:", error.message);
    return false;
  }
  return true;
}

export interface EmailRecord {
  type: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  delivered: boolean;
}

export async function storeEmail(input: EmailRecord): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("emails").insert([
    {
      type: input.type,
      from_address: input.from,
      to_address: input.to,
      subject: input.subject,
      body: input.body,
      delivered: input.delivered,
    },
  ]);
  if (error) {
    console.error("Supabase email log error:", error.message);
    return false;
  }
  return true;
}

export async function addSubscriber(input: {
  email: string;
  name?: string;
  source?: "signup" | "booking" | "newsletter" | "admin";
}): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("subscribers").upsert(
    {
      email: input.email.trim().toLowerCase(),
      name: input.name?.trim() || null,
      source: input.source ?? "newsletter",
      unsubscribed_at: null,
    },
    { onConflict: "email" }
  );
  if (error) {
    console.error("Supabase subscriber upsert error:", error.message);
    return false;
  }
  return true;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  image_url: string | null;
  is_online: boolean;
  is_paid: boolean;
  ticket_price_kes: number | null;
  created_at: string;
}

async function loadEvents(): Promise<Event[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("events")
    .select("id,title,description,event_date,event_time,venue,image_url,is_online,is_paid,ticket_price_kes,created_at")
    .order("event_date", { ascending: true });
  if (error) {
    console.error("Supabase events query error:", error.message);
    return [];
  }
  return (data ?? []) as Event[];
}

export const listEvents = unstable_cache(loadEvents, ["site-events"], {
  revalidate: 120,
  tags: ["site-events"],
});

export interface Project {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  created_at: string;
}

async function loadProjects(): Promise<Project[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,category,description,image_url,project_url,created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Supabase projects query error:", error.message);
    return [];
  }
  return (data ?? []) as Project[];
}

export const listProjects = unstable_cache(loadProjects, ["site-projects"], {
  revalidate: 300,
  tags: ["site-projects"],
});
