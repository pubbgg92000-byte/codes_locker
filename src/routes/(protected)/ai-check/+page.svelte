<script lang="ts">
  import { parseCouponLines } from '$lib/coupons';
  import type { CouponDraft } from '$lib/types';
  import Sparkles from 'lucide-svelte/dist/icons/sparkles.svelte';

  let { form } = $props();
  let text = $state('BigBasket: 100 off 100\nBigBasket: 150 cashback on 200\nBigBasket: 100 off 199\nSHEIN: 1000 flat off\nMyntra: 50% off');
  let drafts = $derived(parseCouponLines(text));
  let editableDrafts = $state<CouponDraft[]>([]);

  $effect(() => {
    editableDrafts = drafts.map((draft) => ({ ...draft }));
  });
</script>

<svelte:head>
  <title>AI-check · Codes Locker</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="flex items-center gap-2 text-3xl font-black">
      <Sparkles class="text-coral" size={26} />
      AI-check
    </h1>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Review suggested brand, type, and value cleanup before saving.</p>
  </div>

  {#if form?.error}
    <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{form.error}</p>
  {/if}

  <section class="panel grid gap-4 p-5">
    <label>
      <span class="label">Paste coupons</span>
      <textarea class="textarea mt-1" bind:value={text}></textarea>
    </label>
  </section>

  <form class="panel grid gap-4 p-5" method="POST" action="?/save">
    <input type="hidden" name="drafts" value={JSON.stringify(editableDrafts)} />
    <div class="grid gap-3">
      {#each editableDrafts as draft, index}
        <div class="grid gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800 lg:grid-cols-[1fr_150px_160px_120px]">
          <label>
            <span class="label">Title</span>
            <input class="field mt-1" bind:value={draft.title} />
          </label>
          <label>
            <span class="label">Brand</span>
            <input class="field mt-1" bind:value={draft.brand} />
          </label>
          <label>
            <span class="label">Type</span>
            <input class="field mt-1" bind:value={draft.type} />
          </label>
          <label>
            <span class="label">Value</span>
            <input class="field mt-1" bind:value={draft.valueNotes} />
          </label>
          <label class="lg:col-span-4">
            <span class="label">Code</span>
            <input class="field mt-1" bind:value={draft.code} placeholder="Optional code" />
          </label>
        </div>
      {/each}
    </div>

    <button class="btn btn-primary justify-self-start" type="submit" disabled={!editableDrafts.length}>Save checked coupons</button>
  </form>
</div>
