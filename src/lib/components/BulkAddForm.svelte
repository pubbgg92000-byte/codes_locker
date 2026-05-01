<script lang="ts">
  import { parseCouponLines } from '$lib/coupons';

  let text = $state('BigBasket: 100 off 100\nBigBasket: 150 cashback on 200\nMyntra: 50% off');
  let preview = $derived(parseCouponLines(text));
</script>

<form class="panel grid gap-4 p-5" method="POST" action="?/bulkAdd">
  <div>
    <h2 class="text-lg font-bold">Bulk add</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400">Paste one coupon per line. Brand names before a colon are detected automatically.</p>
  </div>

  <textarea class="textarea" name="bulk" bind:value={text}></textarea>

  {#if preview.length}
    <div class="grid gap-2 rounded-md bg-slate-50 p-3 dark:bg-slate-950">
      {#each preview.slice(0, 4) as item}
        <p class="text-sm">
          <span class="font-semibold">{item.brand}</span>
          <span class="text-slate-500 dark:text-slate-400"> · {item.type} · {item.title}</span>
        </p>
      {/each}
    </div>
  {/if}

  <button class="btn btn-secondary justify-self-start" type="submit">Import coupons</button>
</form>
