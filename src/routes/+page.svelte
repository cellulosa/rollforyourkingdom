<script lang="ts">
	import Homepage from '$lib/components/Homepage.svelte';
	import Login from '$lib/components/Login.svelte';
	import Game from '$lib/components/Game.svelte';
	import type { LayoutData } from './$types';
	import { state } from '$lib/stores';
	import { StateSchema } from '$lib/zod';
	import type { State } from '@prisma/client';

	export let data: LayoutData;

	// If we are logged in and there is a game, load it
	let loadGame = false;
	if (data.session?.user && StateSchema.safeParse(data.state).success) loadGame = true;
	if (loadGame) state.setState(data.state as State);
</script>

<svelte:head>
	<title>Roll for your kingdom</title>
</svelte:head>

{#if loadGame}
	<Game />
{:else}
	<h1 class="text-4xl font-bold mt-0 mb-6">Roll for your Kingdom</h1>

	<Homepage />

	<Login />
{/if}
