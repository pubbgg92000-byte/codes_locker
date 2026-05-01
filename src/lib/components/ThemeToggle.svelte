<script lang="ts">
  import { Moon, Sun } from 'lucide-svelte';

  let dark = $state(false);

  $effect(() => {
    dark = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('codes-locker-theme', dark ? 'dark' : 'light');
  }
</script>

<button class="btn btn-secondary w-10 px-0" type="button" onclick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
  {#if dark}
    <Sun size={17} />
  {:else}
    <Moon size={17} />
  {/if}
</button>
