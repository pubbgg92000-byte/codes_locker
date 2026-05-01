import type { SupabaseClient } from "@supabase/supabase-js";

export async function findOrCreateBrand(
  supabase: SupabaseClient,
  userId: string,
  name: string,
) {
  const cleaned = name.trim() || "General";
  const { data: existing } = await supabase
    .from("coupon_brands")
    .select("id")
    .eq("user_id", userId)
    .ilike("name", cleaned)
    .maybeSingle();

  if (existing) return existing.id as string;

  const { data, error } = await supabase
    .from("coupon_brands")
    .insert({ user_id: userId, name: cleaned })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function findOrCreateType(
  supabase: SupabaseClient,
  userId: string,
  name: string,
) {
  const cleaned = name.trim() || "Amount off";
  const { data: existing } = await supabase
    .from("coupon_types")
    .select("id")
    .eq("user_id", userId)
    .ilike("name", cleaned)
    .maybeSingle();

  if (existing) return existing.id as string;

  const { data, error } = await supabase
    .from("coupon_types")
    .insert({ user_id: userId, name: cleaned })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}
