<script lang="ts">
  import type { Brand, Coupon, CouponType } from "$lib/types";
  import { Check } from "lucide-svelte";
  import {
  CopyCheck,
  Pencil,
  Moon,
  Sun,
  Bot,
  Settings,
  Sparkles
} from "lucide-svelte"
  // import CopyCheck from "lucide-svelte/dist/icons/copy-check.svelte";
  // import Pencil from "lucide-svelte/dist/icons/pencil.svelte";
  import RotateCcw from "lucide-svelte/dist/icons/rotate-ccw.svelte";
  import { Trash2 } from "lucide-svelte";
  import X from "lucide-svelte/dist/icons/x.svelte";

  let {
    coupon,
    brands,
    types,
  }: {
    coupon: Coupon;
    brands: Brand[];
    types: CouponType[];
  } = $props();

  let editing = $state(false);
  const expired = $derived(
    Boolean(
      coupon.expires_at &&
        coupon.expires_at < new Date().toISOString().slice(0, 10),
    ),
  );
</script>

<article class="panel p-4">
  <div
    class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
  >
    <div class={coupon.is_used ? "opacity-60" : ""}>
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-md bg-signal/10 px-2 py-1 text-xs font-bold text-blue-700 dark:text-blue-300"
        >
          {coupon.coupon_brands?.name ?? "General"}
        </span>
        <span
          class="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          {coupon.coupon_types?.name ?? "Coupon"}
        </span>
        {#if expired}
          <span
            class="rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-200"
            >Expired</span
          >
        {:else if coupon.is_used}
          <span
            class="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >Used</span
          >
        {:else}
          <span
            class="rounded-md bg-mint/10 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300"
            >Available</span
          >
        {/if}
      </div>
      <h3 class:line-through={coupon.is_used} class="mt-3 text-lg font-bold">
        {coupon.title}
      </h3>
      <p
        class:line-through={coupon.is_used}
        class="mt-1 text-sm text-slate-500 dark:text-slate-400"
      >
        {coupon.is_used
          ? coupon.code || "No code"
          : "Code hidden until selected"}{coupon.value_notes
          ? ` · ${coupon.value_notes}`
          : ""}{coupon.expires_at ? ` · Expires ${coupon.expires_at}` : ""}
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      {#if !coupon.is_used}
        <form method="POST" action="?/redeemCoupon">
          <input type="hidden" name="id" value={coupon.id} />
          <button
            class="btn btn-primary gap-2"
            type="submit"
            aria-label="Get selected code"
            title="Get selected code"
          >
            <CopyCheck size={17} />
            Get code
          </button>
        </form>
      {/if}
      <form method="POST" action="?/toggleUsed">
        <input type="hidden" name="id" value={coupon.id} />
        <input
          type="hidden"
          name="is_used"
          value={coupon.is_used ? "false" : "true"}
        />
        <button
          class="btn btn-secondary w-10 px-0"
          type="submit"
          aria-label={coupon.is_used ? "Mark available" : "Mark used"}
          title={coupon.is_used ? "Mark available" : "Mark used"}
        >
          {#if coupon.is_used}
            <RotateCcw size={17} />
          {:else}
            <Check size={17} />
          {/if}
        </button>
      </form>
      <button
        class="btn btn-secondary w-10 px-0"
        type="button"
        onclick={() => (editing = !editing)}
        aria-label="Edit coupon"
        title="Edit coupon"
      >
        {#if editing}<X size={17} />{:else}<Pencil size={17} />{/if}
      </button>
      <form method="POST" action="?/deleteCoupon">
        <input type="hidden" name="id" value={coupon.id} />
        <button
          class="btn btn-danger w-10 px-0"
          type="submit"
          aria-label="Delete coupon"
          title="Delete coupon"
        >
          <Trash2 size={17} />
        </button>
      </form>
    </div>
  </div>

  {#if editing}
    <form
      class="mt-4 grid gap-3 border-t border-slate-200 pt-4 dark:border-slate-800"
      method="POST"
      action="?/updateCoupon"
    >
      <input type="hidden" name="id" value={coupon.id} />
      <div class="grid gap-3 sm:grid-cols-2">
        <input
          class="field"
          name="brand"
          list="edit-brands"
          value={coupon.coupon_brands?.name ?? ""}
          required
        />
        <input
          class="field"
          name="type"
          list="edit-types"
          value={coupon.coupon_types?.name ?? ""}
          required
        />
      </div>
      <input class="field" name="title" value={coupon.title} required />
      <div class="grid gap-3 sm:grid-cols-3">
        <input
          class="field"
          name="code"
          value={coupon.code}
          placeholder="Code"
        />
        <input
          class="field"
          name="value_notes"
          value={coupon.value_notes ?? ""}
          placeholder="Value notes"
        />
        <input
          class="field"
          name="expires_at"
          type="date"
          value={coupon.expires_at ?? ""}
        />
      </div>
      <button class="btn btn-primary justify-self-start" type="submit"
        >Save changes</button
      >
    </form>
  {/if}
</article>

<datalist id="edit-brands">
  {#each brands as brand}
    <option value={brand.name}></option>
  {/each}
</datalist>

<datalist id="edit-types">
  {#each types as type}
    <option value={type.name}></option>
  {/each}
</datalist>
