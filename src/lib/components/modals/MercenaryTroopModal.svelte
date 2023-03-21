<script lang="ts">
	import { highlightEnemyIds, state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { AdvancementEnumSchema, ResourceEnumSchema } from '$lib/zod';

	export let canStillHire: boolean;
	export let isModalOpen: boolean = false;
	export let hasSteelWeaponry: boolean = false;

	// If we unlocked STEEL WEAPONRY and have enough gold to pay that extra mercenary
	const canHireExtra = hasSteelWeaponry && $state.gold >= 2;

	// Set enemy object
	const enemy = helpers.get.enemyById($highlightEnemyIds[0]);

	// Handle hire
	const handleClick = () => {
		// Make sure we can actually complete this action
		if (!canStillHire) return;

		// Update state
		state.updateState(
			{
				[enemy.id]: helpers.remove.enemy($state[enemy.id], 3),
				gold: helpers.remove.resource($state.gold, 1),
				mercenaryTroopsHired: $state.mercenaryTroopsHired + 1
			},
			$state
		);

		// Reset state
		cancel();
	};

	// Handle hire with STEEL WEAPONRY advancement unlocked
	const handleExtra = () => {
		// Make sure we can actually complete this action
		if (!canHireExtra) return;

		// Update state
		state.updateState(
			{
				[enemy.id]: helpers.remove.enemy($state[enemy.id], 4),
				gold: helpers.remove.resource($state.gold, 2),
				mercenaryTroopsHired: $state.mercenaryTroopsHired + 1
			},
			$state
		);

		// Reset state
		cancel();
	};

	// Reset state
	const cancel = () => {
		$highlightEnemyIds = [];
		isModalOpen = false;
	};
</script>

<div class="modal modal-bottom sm:modal-middle" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<p class="py-2">
			You are going to remove 3 Enemies from {enemy.name} by hiring a mercenary troop for the price of
			{helpers.text.addS(1, ResourceEnumSchema.Values.gold)}. If you proceed they will get to {helpers.text.addS(
				$state[enemy.id] - 3,
				'troop'
			)} and you will have
			{helpers.text.addS($state.gold - 1, ResourceEnumSchema.Values.gold)}.
		</p>
		{#if canHireExtra}
			<p>
				Since you unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.steelWeaponry)
					.name}, and have enough gold, you can pay 1 extra Gold to eliminate 1 extra Enemy. If you
				proceed they will get to {helpers.text.addS($state[enemy.id] - 4, 'troop')} and you will have
				{helpers.text.addS($state.gold - 2, ResourceEnumSchema.Values.gold)}.
			</p>
		{/if}
		<div class="modal-action">
			{#if canHireExtra}
				<button class="btn btn-warning" on:click={handleExtra}>Pay extra gold!</button>
			{/if}
			<button class="btn btn-success" on:click={handleClick}>Hire!</button>
			<button class="btn btn-error" on:click={cancel}>Cancel</button>
		</div>
	</div>
</div>
