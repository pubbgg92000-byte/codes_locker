import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
  const { session } = await locals.safeGetSession();
  if (session) redirect(303, "/dashboard");

  return {
    success:
      url.searchParams.get("created") === "1"
        ? "Account created. Log in with the same email and password."
        : undefined,
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: friendlyLoginError(error.message) };

    redirect(303, "/dashboard");
  },
};

function friendlyLoginError(message: string) {
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Email is not confirmed yet. Confirm it from your inbox, or turn off email confirmations in Supabase Auth settings for instant login.";
  }

  return message;
}
