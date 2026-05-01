import { fail } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  const { data: profile } = await locals.supabase
    .from("profiles")
    .select("display_name, created_at")
    .eq("id", user!.id)
    .maybeSingle();

  return { profile };
};

export const actions = {
  updateProfile: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();

    const { error } = await locals.supabase
      .from("profiles")
      .upsert({
        id: user!.id,
        display_name: String(form.get("display_name") ?? "").trim() || null,
      })
      .eq("id", user!.id);

    if (error) return fail(400, { error: error.message });

    return { saved: true };
  },
};
