<script lang="ts">
	import { state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { defaults } from '$lib/game/defaults';
	import Button from '$lib/components/ui/Button.svelte';
	import Message from '$lib/components/ui/Message.svelte';

	// The submit button will create a dice array and move to the next stage
	const handleClick = () =>
		state.updateState(
			{
				dice: Array.from({ length: defaults.dice }, () => helpers.dice.roll()),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

<Message>
	Roll five d6; then you can either reroll some of the dice OR turn one die to a face of your
	choice.
</Message>

<Button pulse={true} {handleClick}>Roll</Button>
