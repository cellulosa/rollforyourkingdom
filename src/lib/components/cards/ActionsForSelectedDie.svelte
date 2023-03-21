<script lang="ts">
	import { state } from '$lib/stores';
	import Helper from '$lib/components/ui/Helper.svelte';
	import { helpers } from '$lib/game/helpers';
	import { z } from 'zod';

	export let selectedDie: number;
</script>

{#if selectedDie !== undefined && z.number().nonnegative().safeParse(selectedDie).success}
	<ul class="steps steps-vertical">
		{#each helpers.find.actionsFromDie($state.dice[selectedDie]) as action}
			<li
				class="step"
				class:step-primary={action.id === $state.action}
				class:text-primary={action.id === $state.action}
			>
				<Helper hash={action.id}>{action.name}</Helper>
			</li>
		{/each}
	</ul>
{/if}
