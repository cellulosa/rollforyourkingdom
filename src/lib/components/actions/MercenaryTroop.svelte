<script lang="ts">
	import {
		highlightBuildingIds,
		highlightEnemyIds,
		highlightResourceIds,
		pulseEnemyIds,
		state
	} from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import MercenaryTroopModal from '$lib/components/modals/MercenaryTroopModal.svelte';
	import Message from '$lib/components/ui/Message.svelte';
	import {
		AdvancementEnumSchema,
		BuildingEnumSchema,
		EnemyEnumSchema,
		ResourceEnumSchema,
		type EnemyEnumType
	} from '$lib/zod';
	import Button from '$lib/components/ui/Button.svelte';
	import { z } from 'zod';

	let isModalOpen = false;

	// Check if we have taverns in the city
	const countTavernsInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.tavern
	);

	// Check if we can hire a mercenary troop - meaning, if we have at least 1 tavern and 1 gold
	const canHireMercenaryTroops =
		(countTavernsInCitySlots > 0 && z.number().min(1).safeParse($state.gold).success) || false;

	// Sice we can hire more mercenaries, we check reactively whether we already maxed out our limit
	$: canStillHire = countTavernsInCitySlots > $state.mercenaryTroopsHired;

	// If the condition is applicable, highlight taverns and gold slot and pulse enemy slot
	if (canHireMercenaryTroops) {
		$highlightBuildingIds = [BuildingEnumSchema.Values.tavern];
		$highlightResourceIds = [ResourceEnumSchema.Values.gold];
		$pulseEnemyIds = [...Object.values(EnemyEnumSchema.Values)];
	}

	// Check if we have STEEL WEAPONRY
	const hasSteelWeaponry = $state.unlockedAdvancements.includes(
		AdvancementEnumSchema.Values.steelWeaponry
	);

	// Event triggered when we click on an enemy slot
	export const enemySlotClicked = (event: CustomEvent<EnemyEnumType>) => {
		// No need to continue unless we can hire a mercenary troop
		if (!canStillHire) return;

		// Highlight selected enemy slot
		$highlightEnemyIds = [event.detail];

		// Show modal to get confirmation
		isModalOpen = true;
	};

	// Move to the next action
	const handleClick = () =>
		state.updateState(
			{
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if canHireMercenaryTroops}
	<Message>
		You have {helpers.text.addS(countTavernsInCitySlots, BuildingEnumSchema.Values.tavern)} and {helpers.text.addS(
			$state.gold,
			'gold'
		)}, therefore you can hire up to {countTavernsInCitySlots} mercenary troops. Select an enemy slot
		to proceed.
	</Message>

	{#if hasSteelWeaponry}
		<Message>
			Since you unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.steelWeaponry)
				.name}, you can pay 1 extra Gold to eliminate 1 extra Enemy.
		</Message>
	{/if}

	{#if canStillHire}
		<Message>
			You can still still hire {helpers.text.addS(
				countTavernsInCitySlots - $state.mercenaryTroopsHired,
				'troop'
			)}.
		</Message>

		{#if $highlightEnemyIds.length}
			{#key $highlightEnemyIds[0]}
				<MercenaryTroopModal {canStillHire} bind:isModalOpen {hasSteelWeaponry} />
			{/key}
		{/if}
	{:else}
		<Message>You've hired the maximum amount of mercenaries!</Message>
	{/if}
{:else}
	<Message>You have no taverns, so you can't hire any mercenary troops!</Message>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
