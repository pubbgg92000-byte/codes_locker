<script lang="ts">
  let {
    title,
    subtitle,
    action,
    cta,
    alternateHref,
    alternateText,
    error,
    success,
    confirmPassword = false
  }: {
    title: string;
    subtitle: string;
    action: string;
    cta: string;
    alternateHref: string;
    alternateText: string;
    error?: string;
    success?: string;
    confirmPassword?: boolean;
  } = $props();
</script>

<main class="mx-auto grid min-h-[calc(100vh-65px)] max-w-md place-items-center px-4 py-12">
  <section class="panel w-full p-6">
    <h1 class="text-2xl font-black">{title}</h1>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>

    {#if error}
      <p class="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        {error}
      </p>
    {/if}

    {#if success}
      <p class="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
        {success}
      </p>
    {/if}

    <form class="mt-6 space-y-4" method="POST" action={action}>
      <label class="block">
        <span class="label">Email</span>
        <input class="field mt-1" name="email" type="email" autocomplete="email" required />
      </label>
      <label class="block">
        <span class="label">Password</span>
        {#if confirmPassword}
          <input class="field mt-1" name="password" type="password" autocomplete="new-password" required minlength="6" />
        {:else}
          <input class="field mt-1" name="password" type="password" autocomplete="current-password" required minlength="6" />
        {/if}
      </label>
      {#if confirmPassword}
        <label class="block">
          <span class="label">Re-enter password</span>
          <input class="field mt-1" name="confirm_password" type="password" autocomplete="new-password" required minlength="6" />
        </label>
      {/if}
      <button class="btn btn-primary w-full" type="submit">{cta}</button>
    </form>

    <a class="mt-5 block text-center text-sm font-semibold text-signal hover:underline" href={alternateHref}>
      {alternateText}
    </a>
  </section>
</main>
