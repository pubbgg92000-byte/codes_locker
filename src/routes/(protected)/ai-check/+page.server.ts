import type { CouponDraft } from '$lib/types';
import { findOrCreateBrand, findOrCreateType } from '$lib/server/coupon-data';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  save: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();
    const raw = String(form.get('drafts') ?? '[]');

    try {
      const drafts = JSON.parse(raw) as CouponDraft[];

      for (const draft of drafts) {
        const brandId = await findOrCreateBrand(locals.supabase, user!.id, draft.brand);
        const typeId = await findOrCreateType(locals.supabase, user!.id, draft.type);

        const { error } = await locals.supabase.from('coupons').insert({
          user_id: user!.id,
          brand_id: brandId,
          type_id: typeId,
          title: draft.title,
          code: draft.code,
          value_notes: draft.valueNotes || null
        });

        if (error) throw error;
      }
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not save suggestions.' });
    }

    redirect(303, '/dashboard');
  }
};
