<script lang="ts">
  import '../app.css';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LogOut from 'lucide-svelte/dist/icons/log-out.svelte';
  import ShieldCheck from 'lucide-svelte/dist/icons/shield-check.svelte';

  let { data, children } = $props();
</script>

<svelte:head>
  <title>Codes Locker</title>
  <meta
    name="description"
    content="A private coupon and promo code locker with Supabase auth and row level security."
  />
</svelte:head>

<div class="min-h-screen">
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#0d1118]/90">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="/" class="inline-flex items-center gap-2 text-sm font-bold">
        <span class="grid size-9 place-items-center rounded-md bg-signal text-white">
          <ShieldCheck size={19} />
        </span>
        <span>Codes Locker</span>
      </a>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        {#if data.session}
          <a class="btn btn-secondary hidden sm:inline-flex" href="/dashboard">Dashboard</a>
          <form method="POST" action="/logout">
            <button class="btn btn-secondary" type="submit" aria-label="Log out" title="Log out">
              <LogOut size={17} />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </form>
        {:else}
          <a class="btn btn-secondary" href="/login">Login</a>
          <a class="btn btn-primary" href="/signup">Sign up</a>
        {/if}
      </div>
    </nav>
  </header>

  {@render children()}
</div>
