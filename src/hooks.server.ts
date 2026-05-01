import { env } from "$env/dynamic/public";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const cookies: CookieMethodsServer = {
    getAll: () => event.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        event.cookies.set(name, value, { ...options, path: "/" });
      });
    },
  };

  event.locals.supabase = createServerClient(
    env.PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
    env.PUBLIC_SUPABASE_ANON_KEY || "missing-supabase-anon-key",
    {
      cookies: {
        getAll: cookies.getAll,
        setAll: cookies.setAll,
      },
    },
  );

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) return { session: null, user: null };

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();

    if (error) return { session: null, user: null };

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
