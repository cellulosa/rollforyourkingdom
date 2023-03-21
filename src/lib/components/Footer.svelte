<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { state } from '$lib/stores';
	import { Github } from '@steeze-ui/simple-icons';
</script>

<footer class="footer items-center p-4 bg-neutral text-neutral-content">
	<div class="items-center grid-flow-col">
		<Icon src={Github} theme="outline" class="h-5 w-5" />
		<p>
			<a href="https://github.com/cellulosa/rollforyourkingdom" target="_blank"
				>Roll for your kingdom</a
			>
		</p>
	</div>

	{#if $state}
		<div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
			<button on:click={() => signOut()}>Logout</button>
		</div>
	{/if}
</footer>
