import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const localAdapter = () => ({
	name: 'local-dev-adapter',
	adapt: () => {}
});

const adapter = process.env.VERCEL
	? (await import('@sveltejs/adapter-vercel')).default
	: localAdapter;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;
