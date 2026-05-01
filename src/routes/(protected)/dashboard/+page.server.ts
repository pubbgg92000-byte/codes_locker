import { parseCouponLines } from "$lib/coupons";
import { findOrCreateBrand, findOrCreateType } from "$lib/server/coupon-data";
import { fail } from "@sveltejs/kit";

const today = () => new Date().toISOString().slice(0, 10);

export const load = async ({ locals, url }) => {
  const { user } = await locals.safeGetSession();
  const filters = {
    search: url.searchParams.get("search") ?? "",
    brand: url.searchParams.get("brand") ?? "",
    type: url.searchParams.get("type") ?? "",
    status: url.searchParams.get("status") ?? "available",
    expiry: url.searchParams.get("expiry") ?? "",
  };

  const [brandsResult, typesResult] = await Promise.all([
    locals.supabase
      .from("coupon_brands")
      .select("id, name")
      .eq("user_id", user!.id)
      .order("name"),
    locals.supabase
      .from("coupon_types")
      .select("id, name")
      .eq("user_id", user!.id)
      .order("name"),
  ]);

  const [availableCountResult, usedCountResult] = await Promise.all([
    locals.supabase
      .from("coupons")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .eq("is_used", false),
    locals.supabase
      .from("coupons")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .eq("is_used", true),
  ]);

  let couponsQuery = locals.supabase
    .from("coupons")
    .select("*, coupon_brands(id, name), coupon_types(id, name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (filters.brand) couponsQuery = couponsQuery.eq("brand_id", filters.brand);
  if (filters.type) couponsQuery = couponsQuery.eq("type_id", filters.type);
  if (filters.status === "available")
    couponsQuery = couponsQuery.eq("is_used", false);
  if (filters.status === "used")
    couponsQuery = couponsQuery.eq("is_used", true);
  if (filters.expiry === "expired")
    couponsQuery = couponsQuery.lt("expires_at", today());
  if (filters.expiry === "active")
    couponsQuery = couponsQuery.or(
      `expires_at.is.null,expires_at.gte.${today()}`,
    );
  if (filters.expiry === "none")
    couponsQuery = couponsQuery.is("expires_at", null);
  if (filters.expiry === "soon") {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    couponsQuery = couponsQuery
      .gte("expires_at", today())
      .lte("expires_at", nextWeek.toISOString().slice(0, 10));
  }
  if (filters.search) {
    const search = filters.search.replace(/[%,]/g, " ").trim();
    couponsQuery = couponsQuery.or(
      `title.ilike.%${search}%,code.ilike.%${search}%,value_notes.ilike.%${search}%`,
    );
  }

  const couponsResult = await couponsQuery;

  return {
    filters,
    brands: brandsResult.data ?? [],
    types: typesResult.data ?? [],
    coupons: couponsResult.data ?? [],
    stats: {
      available: availableCountResult.count ?? 0,
      used: usedCountResult.count ?? 0,
    },
    errors: {
      brands: brandsResult.error?.message,
      types: typesResult.error?.message,
      coupons: couponsResult.error?.message,
    },
  };
};

export const actions = {
  addCoupon: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();

    try {
      const brandId = await findOrCreateBrand(
        locals.supabase,
        user!.id,
        String(form.get("brand") ?? "General"),
      );
      const typeId = await findOrCreateType(
        locals.supabase,
        user!.id,
        String(form.get("type") ?? "Amount off"),
      );

      const { error } = await locals.supabase.from("coupons").insert({
        user_id: user!.id,
        brand_id: brandId,
        type_id: typeId,
        title: String(form.get("title") ?? "").trim(),
        code: String(form.get("code") ?? "").trim(),
        value_notes: String(form.get("value_notes") ?? "").trim() || null,
        expires_at: String(form.get("expires_at") ?? "") || null,
      });

      if (error) throw error;
    } catch (error) {
      return fail(400, {
        error:
          error instanceof Error ? error.message : "Could not save coupon.",
      });
    }
  },

  bulkAdd: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();
    const drafts = parseCouponLines(String(form.get("bulk") ?? ""));

    try {
      for (const draft of drafts) {
        const brandId = await findOrCreateBrand(
          locals.supabase,
          user!.id,
          draft.brand,
        );
        const typeId = await findOrCreateType(
          locals.supabase,
          user!.id,
          draft.type,
        );

        const { error } = await locals.supabase.from("coupons").insert({
          user_id: user!.id,
          brand_id: brandId,
          type_id: typeId,
          title: draft.title,
          code: draft.code,
          value_notes: draft.valueNotes || null,
        });

        if (error) throw error;
      }
    } catch (error) {
      return fail(400, {
        error:
          error instanceof Error ? error.message : "Could not import coupons.",
      });
    }
  },

  updateCoupon: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();
    const id = String(form.get("id") ?? "");

    try {
      const brandId = await findOrCreateBrand(
        locals.supabase,
        user!.id,
        String(form.get("brand") ?? "General"),
      );
      const typeId = await findOrCreateType(
        locals.supabase,
        user!.id,
        String(form.get("type") ?? "Amount off"),
      );

      const { error } = await locals.supabase
        .from("coupons")
        .update({
          brand_id: brandId,
          type_id: typeId,
          title: String(form.get("title") ?? "").trim(),
          code: String(form.get("code") ?? "").trim(),
          value_notes: String(form.get("value_notes") ?? "").trim() || null,
          expires_at: String(form.get("expires_at") ?? "") || null,
        })
        .eq("id", id)
        .eq("user_id", user!.id);

      if (error) throw error;
    } catch (error) {
      return fail(400, {
        error:
          error instanceof Error ? error.message : "Could not update coupon.",
      });
    }
  },

  toggleUsed: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();
    const isUsed = String(form.get("is_used")) === "true";

    const { error } = await locals.supabase
      .from("coupons")
      .update({
        is_used: isUsed,
        used_at: isUsed ? new Date().toISOString() : null,
      })
      .eq("id", String(form.get("id") ?? ""))
      .eq("user_id", user!.id);

    if (error) return fail(400, { error: error.message });
  },

  redeemCoupon: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();
    const id = String(form.get("id") ?? "");

    const { data, error } = await locals.supabase
      .from("coupons")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user!.id)
      .eq("is_used", false)
      .select("title, code")
      .maybeSingle();

    if (error) return fail(400, { error: error.message });
    if (!data)
      return fail(400, {
        error: "This coupon is already used or no longer available.",
      });

    return {
      redeemed: {
        title: data.title,
        code: data.code || "No code saved",
      },
    };
  },

  deleteCoupon: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    const form = await request.formData();
    const { error } = await locals.supabase
      .from("coupons")
      .delete()
      .eq("id", String(form.get("id") ?? ""))
      .eq("user_id", user!.id);

    if (error) return fail(400, { error: error.message });
  },
};
