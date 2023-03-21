<script lang="ts">
	import { state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { ActionEnumSchema } from '$lib/zod';

	state.updateState(
		{
			action:
				helpers.dice.format($state.dice).set.length !== $state.playedDice.length
					? // If we still have dice to play load the playDie action
					  ActionEnumSchema.Values.playDie
					: // Otherwise move to the feedTheHungry action
					  ActionEnumSchema.Values.feedTheHungry
		},
		$state
	);
</script>
