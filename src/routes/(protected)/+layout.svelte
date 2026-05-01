<script lang="ts">
  import { Bot, LayoutDashboard, Settings } from 'lucide-svelte';

  let { children } = $props();
</script>

<div class="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
  <aside class="md:sticky md:top-24 md:h-fit">
    <div class="panel p-2">
      <a class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" href="/dashboard">
        <LayoutDashboard size={17} />
        Dashboard
      </a>
      <a class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" href="/ai-check">
        <Bot size={17} />
        AI-check
      </a>
      <a class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" href="/settings">
        <Settings size={17} />
        Settings
      </a>
    </div>
  </aside>

  <section>
    {@render children()}
  </section>
</div>
