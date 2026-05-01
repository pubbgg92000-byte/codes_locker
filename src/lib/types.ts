export type CouponStatus = "available" | "used" | "expired";

export type Brand = {
  id: string;
  name: string;
};

export type CouponType = {
  id: string;
  name: string;
};

export type Coupon = {
  id: string;
  code: string;
  title: string;
  value_notes: string | null;
  expires_at: string | null;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
  brand_id: string | null;
  type_id: string | null;
  coupon_brands: Brand | null;
  coupon_types: CouponType | null;
};

export type CouponDraft = {
  source: string;
  brand: string;
  type: string;
  title: string;
  valueNotes: string;
  code: string;
};
