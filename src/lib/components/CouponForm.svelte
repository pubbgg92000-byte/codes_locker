<script lang="ts">
  import type { Brand, CouponType } from '$lib/types';

  let {
    brands,
    types,
    action = '?/addCoupon'
  }: {
    brands: Brand[];
    types: CouponType[];
    action?: string;
  } = $props();
</script>

<form class="panel grid gap-4 p-5" method="POST" action={action}>
  <div>
    <h2 class="text-lg font-bold">Add coupon</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400">Save one offer with brand and type metadata.</p>
  </div>

  <div class="grid gap-4 sm:grid-cols-2">
    <label>
      <span class="label">Brand</span>
      <input class="field mt-1" name="brand" list="brands" placeholder="BigBasket" required />
    </label>
    <label>
      <span class="label">Type</span>
      <input class="field mt-1" name="type" list="types" placeholder="Amount off" required />
    </label>
  </div>

  <label>
    <span class="label">Coupon title</span>
    <input class="field mt-1" name="title" placeholder="100 off 199" required />
  </label>

  <div class="grid gap-4 sm:grid-cols-3">
    <label>
      <span class="label">Code</span>
      <input class="field mt-1" name="code" placeholder="BB100" />
    </label>
    <label>
      <span class="label">Value notes</span>
      <input class="field mt-1" name="value_notes" placeholder="₹100" />
    </label>
    <label>
      <span class="label">Expires</span>
      <input class="field mt-1" name="expires_at" type="date" />
    </label>
  </div>

  <button class="btn btn-primary justify-self-start" type="submit">Save coupon</button>
</form>

<datalist id="brands">
  {#each brands as brand}
    <option value={brand.name}></option>
  {/each}
</datalist>

<datalist id="types">
  {#each types as type}
    <option value={type.name}></option>
  {/each}
</datalist>
