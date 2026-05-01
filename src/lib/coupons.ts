import type { CouponDraft } from '$lib/types';

const knownBrands = ['BigBasket', 'SHEIN', 'Myntra', 'Amazon', 'Flipkart', 'Swiggy', 'Zomato'];

export function inferCoupon(line: string): CouponDraft {
  const source = line.trim();
  const [rawBrand, rawOffer = source] = source.includes(':')
    ? source.split(/:(.+)/).map((part) => part.trim())
    : ['', source];

  const brand = normalizeBrand(rawBrand || guessBrand(source));
  const offer = rawOffer.trim();
  const lower = offer.toLowerCase();
  const type = inferType(lower);
  const valueNotes = inferValue(offer);

  return {
    source,
    brand,
    type,
    title: offer || source,
    valueNotes,
    code: ''
  };
}

export function parseCouponLines(text: string): CouponDraft[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(inferCoupon);
}

function guessBrand(source: string) {
  const match = knownBrands.find((brand) => source.toLowerCase().includes(brand.toLowerCase()));
  return match ?? 'General';
}

function normalizeBrand(value: string) {
  const match = knownBrands.find((brand) => brand.toLowerCase() === value.trim().toLowerCase());
  return match ?? titleCase(value || 'General');
}

function inferType(lower: string) {
  if (lower.includes('cashback')) return 'Cashback';
  if (lower.includes('%')) return 'Percentage off';
  if (lower.includes('flat')) return 'Flat off';
  if (lower.includes('free')) return 'Freebie';
  return 'Amount off';
}

function inferValue(value: string) {
  const percentage = value.match(/\d+\s*%/);
  if (percentage) return percentage[0].replace(/\s+/g, '');

  const amount = value.match(/(?:rs\.?|inr|₹)?\s*\d{2,5}/i);
  if (amount) return amount[0].replace(/(?:rs\.?|inr)/i, '₹').replace(/\s+/g, '');

  return value;
}

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
