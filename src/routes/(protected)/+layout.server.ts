import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) redirect(303, '/login');

  return { session, user };
};
