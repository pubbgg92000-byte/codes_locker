<script lang="ts">
import {
  CopyCheck,
  Pencil,
  Moon,
  Sun,
  Bot,
  Settings,
  Sparkles
} from "lucide-svelte"
  import ArrowRight from 'lucide-svelte/dist/icons/arrow-right.svelte';
  import CircleCheck from 'lucide-svelte/dist/icons/circle-check.svelte';
  import Database from 'lucide-svelte/dist/icons/database.svelte';
  import LockKeyhole from 'lucide-svelte/dist/icons/lock-keyhole.svelte';
  // import Sparkles from 'lucide-svelte/dist/icons/sparkles.svelte';

  let { data } = $props();
</script>

<main>
  <section class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1118]">
    <div class="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p class="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <LockKeyhole size={16} />
          Private coupons, protected by Supabase RLS
        </p>
        <h1 class="max-w-3xl text-4xl font-black tracking-normal text-slate-950 dark:text-white sm:text-6xl">
          Codes Locker
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          A secure, searchable locker for discounts, cashbacks, flat-off codes, and brand-specific deals.
          Every account gets its own private coupon database.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          {#if data.session}
            <a class="btn btn-primary" href="/dashboard">
              Open dashboard
              <ArrowRight size={17} />
            </a>
          {:else}
            <a class="btn btn-primary" href="/signup">
              Create locker
              <ArrowRight size={17} />
            </a>
            <a class="btn btn-secondary" href="/login">Login</a>
          {/if}
        </div>
      </div>

      <div class="panel overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Available coupons</p>
        </div>
        <div class="space-y-3 p-5">
          {#each [
            ['BigBasket', '100 off 100', 'Amount off'],
            ['BigBasket', '150 cashback on 200', 'Cashback'],
            ['SHEIN', '1000 flat off', 'Flat off'],
            ['Myntra', '50% off', 'Percentage off']
          ] as coupon}
            <div class="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p class="font-semibold">{coupon[0]}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">{coupon[1]}</p>
              </div>
              <span class="rounded-md bg-mint/10 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {coupon[2]}
              </span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3">
    <div class="panel p-5">
      <CircleCheck class="mb-4 text-mint" size={24} />
      <h2 class="font-bold">Track status</h2>
      <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Used coupons are crossed out and removed from the available view.</p>
    </div>
    <div class="panel p-5">
      <Database class="mb-4 text-signal" size={24} />
      <h2 class="font-bold">Organize deeply</h2>
      <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Filter by brand, type, status, expiry, and text search.</p>
    </div>
    <div class="panel p-5">
      <Sparkles class="mb-4 text-coral" size={24} />
      <h2 class="font-bold">Check before saving</h2>
      <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">AI-check suggests brand, type, and value cleanup for messy pasted offers.</p>
    </div>
  </section>
</main>
