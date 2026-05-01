<script lang="ts">
  import type { Brand, CouponType } from '$lib/types';

  let {
    brands,
    types,
    filters
  }: {
    brands: Brand[];
    types: CouponType[];
    filters: Record<string, string>;
  } = $props();
</script>

<form class="panel grid gap-3 p-4 lg:grid-cols-[1fr_150px_150px_140px_150px_auto]" method="GET">
  <input class="field" name="search" placeholder="Search coupons" value={filters.search ?? ''} />

  <select class="field" name="brand">
    <option value="">All brands</option>
    {#each brands as brand}
      <option value={brand.id} selected={filters.brand === brand.id}>{brand.name}</option>
    {/each}
  </select>

  <select class="field" name="type">
    <option value="">All types</option>
    {#each types as type}
      <option value={type.id} selected={filters.type === type.id}>{type.name}</option>
    {/each}
  </select>

  <select class="field" name="status">
    <option value="available" selected={filters.status === 'available'}>Available</option>
    <option value="all" selected={filters.status === 'all'}>All</option>
    <option value="used" selected={filters.status === 'used'}>Used</option>
  </select>

  <select class="field" name="expiry">
    <option value="" selected={!filters.expiry}>Any expiry</option>
    <option value="active" selected={filters.expiry === 'active'}>Active</option>
    <option value="expired" selected={filters.expiry === 'expired'}>Expired</option>
    <option value="soon" selected={filters.expiry === 'soon'}>Next 7 days</option>
    <option value="none" selected={filters.expiry === 'none'}>No expiry</option>
  </select>

  <button class="btn btn-primary" type="submit">Filter</button>
</form>
