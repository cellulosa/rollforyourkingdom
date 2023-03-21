<script lang="ts">
	import { state, pulseCityDistrictSlotIndex, highlightCityDistrictSlotIndexes } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { AdvancementEnumSchema, BuildingEnumSchema } from '$lib/zod';

	// Find those districts that have 4 or more buildings
	const cityDistrictIdswithMoreThan4Buildings = helpers.find.cityDistrictIds.withMoreThanOccupied(
		4,
		$state.citySlots
	);

	// Find those districts that do not have any market
	const cityDistrictIdswithoutMarket = helpers.find.cityDistrictIds.withoutBuildingId(
		BuildingEnumSchema.Values.market,
		$state.citySlots
	);

	// Highlight those eligile districts - those that exist in both conditions checked earlier
	const conditionAppliesToCityDistrictIds = helpers.find.cityDistrictIds.overlapping(
		...cityDistrictIdswithMoreThan4Buildings,
		...cityDistrictIdswithoutMarket
	);

	// Check whether we have to pay
	const isPlague = conditionAppliesToCityDistrictIds.length > 0;

	// If the condition applies
	if (isPlague) {
		// we pulsate the clickable slots - which are, all buildings
		$pulseCityDistrictSlotIndex =
			helpers.find.cityDistrictSlotIndexes.withOccupied.inCityDistrictIds(
				conditionAppliesToCityDistrictIds,
				$state.citySlots
			);
	}

	// ignore the Plague event if we unlocked MEDICINE until we have at least 1 Abbey
	const hasMedicine = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.medicine);
	let countAbbeysInCityslots: number = 0;
	let canIgnore = false;
	if (hasMedicine)
		countAbbeysInCityslots = helpers.count.buildingIdInCitySlots(
			$state.citySlots,
			BuildingEnumSchema.Values.abbey
		);
	if (hasMedicine && countAbbeysInCityslots < 1) canIgnore = true;

	// Event triggered when we click on a city slot
	export const citySlotClicked = (event: CustomEvent<number>) => {
		// No need to continue unless there is a plague happening
		if (!isPlague) return;

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
	};

	const handleClick = () =>
		state.updateState(
			{
				// If the plague condition is applicable
				...(isPlague && !canIgnore
					? {
							// Build a new citySlots array replacing those selected slots with empty values
							citySlots: $state.citySlots.map((buildingId, slotIndex) =>
								$highlightCityDistrictSlotIndexes.includes(slotIndex)
									? BuildingEnumSchema.Values.none
									: buildingId
							)
					  }
					: // If the plague condition is not applicable, just move to the next action
					  {}),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if canIgnore}
	<Message>
		Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.medicine)
			.name} and do not have any abbey, you can ignore this action.
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
			but no abbey.
		{:else}
			all of which are without an abbey.
		{/if}
		Therefore, {#if conditionAppliesToCityDistrictIds.length > 1}for each{/if} you must erase 1 building.
		Select {#if conditionAppliesToCityDistrictIds.length > 1}these{:else}it{/if} from the city.
	</Message>

	{#if $highlightCityDistrictSlotIndexes.length}
		<Message>
			You are going to destroy {helpers.text.commaSeparatedlist(
				$highlightCityDistrictSlotIndexes.map(
					(slotIndex) =>
						`the ${helpers.get.buildingById($state.citySlots[slotIndex]).name} from ${
							helpers.get.cityDistrictById(helpers.find.cityDistrictId.fromSlotIndex(slotIndex))
								.name
						}`
				)
			)}.
		</Message>
	{/if}
{:else}
	<Message>
		There are no districts with 4 or more buildings but no Abbeys, so nothing to do here.
	</Message>
{/if}

<Button
	pulse={$highlightCityDistrictSlotIndexes.length === conditionAppliesToCityDistrictIds.length}
	{handleClick}>Next</Button
>
