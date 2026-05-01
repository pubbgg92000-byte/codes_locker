<script lang="ts">
  import BulkAddForm from "$lib/components/BulkAddForm.svelte";
  import CouponCard from "$lib/components/CouponCard.svelte";
  import CouponForm from "$lib/components/CouponForm.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte";

  let { data, form } = $props();
</script>

<svelte:head>
  <title>Dashboard · Codes Locker</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div>
      <h1 class="text-3xl font-black">Dashboard</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add, search, update, and redeem your private coupons.
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span
        class="rounded-md bg-mint/10 px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"
        >Available: {data.stats.available}</span
      >
      <span
        class="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >Used: {data.stats.used}</span
      >
      <a class="btn btn-secondary" href="/ai-check">Open AI-check</a>
    </div>
  </div>

  {#if form?.error}
    <p
      class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
    >
      {form.error}
    </p>
  {/if}

  {#if form?.redeemed}
    <div
      class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
    >
      <p class="text-sm font-bold">Selected code</p>
      <p class="mt-1 text-base">{form.redeemed.title}</p>
      <p
        class="mt-2 rounded-md bg-white px-3 py-2 font-mono text-lg font-black tracking-wide text-slate-950 dark:bg-slate-900 dark:text-white"
      >
        {form.redeemed.code}
      </p>
      <p class="mt-2 text-sm">
        This coupon was moved to Used and removed from Available.
      </p>
    </div>
  {/if}

  <div class="grid gap-6 xl:grid-cols-2">
    <CouponForm brands={data.brands} types={data.types} />
    <BulkAddForm />
  </div>

  <FilterBar brands={data.brands} types={data.types} filters={data.filters} />

  <div class="grid gap-3">
    {#if data.coupons.length}
      {#each data.coupons as coupon}
        <CouponCard {coupon} brands={data.brands} types={data.types} />
      {/each}
    {:else}
      <div class="panel p-8 text-center">
        <h2 class="text-lg font-bold">No coupons found</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Add a coupon or adjust your filters.
        </p>
      </div>
    {/if}
  </div>
</div>
