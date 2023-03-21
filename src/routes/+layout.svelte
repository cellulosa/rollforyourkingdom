<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.postcss';
</script>

<Drawer>
	<main class="py-6 px-4 mb-20">
		<SvelteToast />

		<slot />
	</main>

	<Footer />
</Drawer>
