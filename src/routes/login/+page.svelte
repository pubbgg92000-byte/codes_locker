<script lang="ts">
  import AuthCard from '$lib/components/AuthCard.svelte';

  let { data, form } = $props();
</script>

<AuthCard
  title="Welcome back"
  subtitle="Log in to open your private coupon locker."
  action="/login"
  cta="Login"
  alternateHref="/signup"
  alternateText="Need an account? Sign up"
  error={form?.error}
  success={data.success}
/>
