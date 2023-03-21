<script lang="ts">
	import {
		state,
		pulseCityDistrictSlotIndex,
		highlightCityDistrictSlotIndexes,
		highlightResourceIds
	} from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { ResourceEnumSchema, BuildingEnumSchema, AdvancementEnumSchema } from '$lib/zod';

	// Find those districts that have 4 or more buildings
	const cityDistrictIdswithMoreThan4Buildings = helpers.find.cityDistrictIds.withMoreThanOccupied(
		4,
		$state.citySlots
	);

	// Find those districts that do not have any tavern
	const cityDistrictIdswithoutTavern = helpers.find.cityDistrictIds.withoutBuildingId(
		BuildingEnumSchema.Values.tavern,
		$state.citySlots
	);

	// Highlight those eligile districts - those that exist in both conditions checked earlier
	const conditionAppliesToCityDistrictIds = helpers.find.cityDistrictIds.overlapping(
		...cityDistrictIdswithMoreThan4Buildings,
		...cityDistrictIdswithoutTavern
	);

	// Check whether we have to pay
	const isRiot = conditionAppliesToCityDistrictIds.length > 0;

	// If the condition applies
	if (isRiot) {
		// we pulsate the clickable slots - which are, all buildings
		$pulseCityDistrictSlotIndex =
			helpers.find.cityDistrictSlotIndexes.withOccupied.inCityDistrictIds(
				conditionAppliesToCityDistrictIds,
				$state.citySlots
			);

		// And pre-select the gold
		$highlightResourceIds = [ResourceEnumSchema.Values.gold];
	}

	// ignore the Riot event if we unlocked FYRD MILITIA until we have at least 1 Tavern
	const hasFyrdMilitia = $state.unlockedAdvancements.includes(
		AdvancementEnumSchema.Values.fyrdMilitia
	);
	let countTavernsInCityslots: number = 0;
	let canIgnore = false;
	if (hasFyrdMilitia)
		countTavernsInCityslots = helpers.count.buildingIdInCitySlots(
			$state.citySlots,
			BuildingEnumSchema.Values.tavern
		);
	if (hasFyrdMilitia && countTavernsInCityslots < 1) canIgnore = true;

	// Event triggered when we click on a city slot
	export const citySlotClicked = (event: CustomEvent<number>) => {
		// No need to continue unless there is a riot happening
		if (!isRiot) return;

		// Continue only if we clicked an eligible citySlot
		if (!$pulseCityDistrictSlotIndex.includes(event.detail)) return;

		// Allow to select only one slot per district
		$highlightCityDistrictSlotIndexes = [
			...new Set([
				// Add selected slot to our unique array of highlighted slots
				event.detail,
				// if we selected a slotIndex that belongs to a cityDistrictId that already had a slot selected, we override it (this will create a duplicate, but the Set will remove it)
				...$highlightCityDistrictSlotIndexes.map((slotIndex) =>
					helpers.find.cityDistrictId.fromSlotIndex(slotIndex) ===
					helpers.find.cityDistrictId.fromSlotIndex(event.detail)
						? event.detail
						: slotIndex
				)
			])
		];

		// If we selected a building per each district in which the condition applies, we can de-select the gold
		if ($highlightCityDistrictSlotIndexes.length === conditionAppliesToCityDistrictIds.length) {
			$highlightResourceIds = [];
		} else {
			// Otherwise keep the gold selected
			$highlightResourceIds = [ResourceEnumSchema.Values.gold];
		}
	};

	const handleClick = () =>
		state.updateState(
			{
				// If the riot condition is applicable
				...(isRiot && !canIgnore
					? {
							// Build a new citySlots array replacing those selected slots with empty values
							citySlots: $state.citySlots.map((buildingId, slotIndex) =>
								$highlightCityDistrictSlotIndexes.includes(slotIndex)
									? BuildingEnumSchema.Values.none
									: buildingId
							),
							// Calculate the new gold value
							gold: helpers.remove.resource(
								$state.gold,
								(() => {
									// If we selected a citySlot for each district where the riot is applicable, we do not pay any gold
									if (
										$highlightCityDistrictSlotIndexes.length ===
										conditionAppliesToCityDistrictIds.length
									)
										return 0;
									// If we selected some citySlots we need to calculate the remaining to pay in gold
									if (
										$highlightCityDistrictSlotIndexes.length <
										conditionAppliesToCityDistrictIds.length
									)
										return (
											1 * conditionAppliesToCityDistrictIds.length -
											$highlightCityDistrictSlotIndexes.length
										);
									// As default, we pay all in gold
									return 1 * conditionAppliesToCityDistrictIds.length;
								})()
							)
					  }
					: // If the riot condition is not applicable, just move to the next action
					  {}),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if canIgnore}
	<Message>
		Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.fyrdMilitia)
			.name} and do not have any tavern, you can ignore this action.
	</Message>
{:else if conditionAppliesToCityDistrictIds.length}
	<Message>
		You have {helpers.text.commaSeparatedlist(
			conditionAppliesToCityDistrictIds.map(
				(cityDistrictId) =>
					`${helpers.count.occupiedSlotsInDistrictId(
						$state.citySlots,
						cityDistrictId
					)} buildings in ${helpers.get.cityDistrictById(cityDistrictId).name}`
			)
		)},
		{#if conditionAppliesToCityDistrictIds.length === 1}
			but no tavern.
		{:else}
			all of which are without a tavern.
		{/if}
		Therefore, {#if conditionAppliesToCityDistrictIds.length > 1}for each{/if} you must either pay 1
		gold, or erase 1 building.
	</Message>

	<Message>
		{#if !$highlightCityDistrictSlotIndexes.length}
			If you don't select any buildings, you will pay {helpers.text.addS(
				1 * conditionAppliesToCityDistrictIds.length,
				ResourceEnumSchema.Values.gold
			)}. Since you have {$state.gold}, this will get you to {$state.gold -
				1 * conditionAppliesToCityDistrictIds.length}.
		{:else if $highlightCityDistrictSlotIndexes.length !== conditionAppliesToCityDistrictIds.length}
			You are going to destroy {helpers.text.commaSeparatedlist(
				$highlightCityDistrictSlotIndexes.map(
					(slotIndex) =>
						`the ${helpers.get.buildingById($state.citySlots[slotIndex]).name} from ${
							helpers.get.cityDistrictById(helpers.find.cityDistrictId.fromSlotIndex(slotIndex))
								.name
						}`
				)
			)} and pay {helpers.text.addS(
				conditionAppliesToCityDistrictIds.length - $highlightCityDistrictSlotIndexes.length,
				ResourceEnumSchema.Values.gold
			)}.
		{:else}
			You are going to destroy {helpers.text.commaSeparatedlist(
				$highlightCityDistrictSlotIndexes.map(
					(slotIndex) =>
						`the ${helpers.get.buildingById($state.citySlots[slotIndex]).name} from ${
							helpers.get.cityDistrictById(helpers.find.cityDistrictId.fromSlotIndex(slotIndex))
								.name
						}`
				)
			)}.
		{/if}
	</Message>
{:else}
	<Message>
		You have no district with 4 or more buildings but no Tavern, so nothing to do here.
	</Message>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
