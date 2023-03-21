<script lang="ts">
	import { state } from '$lib/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import { z } from 'zod';

	export let selectedDie: number;

	const handleClick = () =>
		state.updateState(
			{
				// Initiate the action
				action: helpers.find.actionsFromDie($state.dice[selectedDie])[0].id,
				// Add selected die to the played array to ensure we can only play it once
				playedDice: helpers.dice.set([...$state.playedDice, $state.dice[selectedDie]])
			},
			$state
		);
</script>

{#if !z.number().nonnegative().safeParse(selectedDie).success}
	<Message
		>Select a die from your dice reserve to see its related actions and start playing.</Message
	>
{/if}

<Button pulse={z.number().nonnegative().safeParse(selectedDie).success} {handleClick}>Next</Button>
