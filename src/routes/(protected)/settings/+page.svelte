<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Settings · Codes Locker</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-black">Settings</h1>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account preferences.</p>
  </div>

  <form class="panel grid max-w-xl gap-4 p-5" method="POST" action="?/updateProfile">
    {#if form?.saved}
      <p class="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">Settings saved.</p>
    {/if}
    {#if form?.error}
      <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{form.error}</p>
    {/if}

    <label>
      <span class="label">Display name</span>
      <input class="field mt-1" name="display_name" value={data.profile?.display_name ?? ''} placeholder="Your name" />
    </label>

    <label>
      <span class="label">Email</span>
      <input class="field mt-1" value={data.user.email} disabled />
    </label>

    <button class="btn btn-primary justify-self-start" type="submit">Save settings</button>
  </form>
</div>
