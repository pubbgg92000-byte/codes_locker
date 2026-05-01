<script lang="ts">
  import AuthCard from '$lib/components/AuthCard.svelte';

  let { form } = $props();
</script>

<AuthCard
  title="Create your locker"
  subtitle="Your coupons stay scoped to your Supabase user account."
  action="/signup"
  cta="Sign up"
  alternateHref="/login"
  alternateText="Already have an account? Login"
  error={form?.error}
  success={form?.success}
  confirmPassword
/>
