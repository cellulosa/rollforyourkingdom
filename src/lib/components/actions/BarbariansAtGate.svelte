<script lang="ts">
	import { state, pulseEnemyIds } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { EnemyEnumSchema, type EnemyEnumType } from '$lib/zod';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Helper from '$lib/components/ui/Helper.svelte';

	// Count all buildings (meaning, occupied slots which aren't trees) - this number will dictate how many troops we need to add to our enemies
	const countOccupiedInCitySlots = helpers.count.occupiedCitySlots($state.citySlots);

	// Pulse enemy slots if the condition applies
	$: {
		$pulseEnemyIds =
			$state.assignedBarbariansAtGate !== countOccupiedInCitySlots
				? [...Object.values(EnemyEnumSchema.Values)]
				: [];
	}

	// Map slots event dispatchers
	export const enemySlotClicked = (event: CustomEvent<EnemyEnumType>) => {
		// Run only until the condition applies
		if ($state.assignedBarbariansAtGate === countOccupiedInCitySlots) return;

		// Update state with the new enemy assigned
		state.updateState(
			{
				// Increase count to keep track of what enemies we already assigned
				assignedBarbariansAtGate: $state.assignedBarbariansAtGate + 1,
				// Add enemy troop to clicked enemy slot
				[event.detail]: helpers.add.enemy($state[event.detail], 1)
			},
			$state
		);
	};

	const handleClick = () =>
		state.updateState(
			{
				// We move to the next stage
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

<Message>
	The <Helper hash={$state.action}>barbarians are at the gate</Helper>!

	{#if countOccupiedInCitySlots > 0}
		You have {helpers.text.addS(countOccupiedInCitySlots, 'building')}. So, you must assign {helpers.text.addS(
			countOccupiedInCitySlots,
			'enemy troop'
		)}
		in total.
	{/if}
</Message>

<Message>
	{#if $state.assignedBarbariansAtGate !== countOccupiedInCitySlots}
		You still need to assign {countOccupiedInCitySlots - $state.assignedBarbariansAtGate} enemy troops.
		Click on any enemy slots to do so. Each click will assign one troop.
	{:else}
		All done!
	{/if}
</Message>

<Button pulse={!($state.assignedBarbariansAtGate !== countOccupiedInCitySlots)} {handleClick}
	>Next</Button
>
