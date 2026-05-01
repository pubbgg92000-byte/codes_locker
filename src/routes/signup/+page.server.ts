import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const { session } = await locals.safeGetSession();
  if (session) redirect(303, "/dashboard");
};

export const actions = {
  default: async ({ request, locals, url }) => {
    const form = await request.formData();
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirm_password") ?? "");

    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }

    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/dashboard`,
      },
    });

    if (error) return { error: friendlyAuthError(error.message) };

    if (data.session) {
      const profileResult = await locals.supabase.from("profiles").upsert({
        id: data.session.user.id,
        display_name: email.split("@")[0] || null,
      });

      if (profileResult.error) {
        await locals.supabase.auth.signOut();
        return { error: friendlyProfileError(profileResult.error.message) };
      }

      await locals.supabase.auth.signOut();
      redirect(303, "/login?created=1");
    }

    return {
      error:
        "Signup created the user, but Supabase email confirmation is still on. Turn off Confirm email in Supabase Authentication > Providers > Email for instant login.",
    };
  },
};

function friendlyAuthError(message: string) {
  if (message.toLowerCase().includes("database error")) {
    return "Supabase created the auth user but could not write the profile. Run supabase/schema.sql in the Supabase SQL editor, then try again with a new email.";
  }

  if (message.toLowerCase().includes("invalid api key")) {
    return "Supabase is not configured. Add PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY to .env.";
  }

  return message;
}

function friendlyProfileError(message: string) {
  if (
    message.toLowerCase().includes("relation") &&
    message.toLowerCase().includes("profiles")
  ) {
    return "Signup worked, but the profiles table does not exist. Run supabase/schema.sql in the Supabase SQL editor, then sign up again with a new email.";
  }

  if (message.toLowerCase().includes("row-level security")) {
    return "Signup worked, but the profile could not be saved because RLS policies are missing or incorrect. Run the full supabase/schema.sql file in Supabase.";
  }

  return `Signup worked, but the profile could not be saved: ${message}`;
}
