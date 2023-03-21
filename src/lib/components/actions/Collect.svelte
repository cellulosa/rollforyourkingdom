<script lang="ts">
	import { state, highlightCityDistrictSlotIndexes, pulseCityDistrictSlotIndex } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { AdvancementEnumSchema, BuildingEnumSchema, ResourceEnumSchema } from '$lib/zod';

	// Handle dispatcher
	export const citySlotClicked = (event: CustomEvent<number>) => {
		// Do not proceed unless we selected an eligible
		if (!$pulseCityDistrictSlotIndex.includes(event.detail)) return;

		// highlight the clicked tree
		$highlightCityDistrictSlotIndexes = [event.detail];
	};

	// Find where there are lumberjacks
	const cityDistrictIdsWithLumberjacks = helpers.find.cityDistrictIds.withBuildingId(
		BuildingEnumSchema.Values.lumberjack,
		$state.citySlots
	);

	// And trees
	const cityDistrictIdsWithTrees = helpers.find.cityDistrictIds.withBuildingId(
		BuildingEnumSchema.Values.tree,
		$state.citySlots
	);

	// And find the overlap between these two
	const conditionAppliesToCityDistrictIds = helpers.find.cityDistrictIds.overlapping(
		...cityDistrictIdsWithLumberjacks,
		...cityDistrictIdsWithTrees
	);

	// If there are any, pulse the relevant trees in case we want to delete one to get additional wood
	if (conditionAppliesToCityDistrictIds.length)
		$pulseCityDistrictSlotIndex =
			helpers.find.cityDistrictSlotIndexes.withBuildingId.inCityDistrictIds(
				conditionAppliesToCityDistrictIds,
				$state.citySlots,
				BuildingEnumSchema.Values.tree
			);

	// Now we work out the base payout

	// Count the lumberjacks in the relevant cityDistrictIds
	const lumberjacksInRelevantCityDistrictIds = helpers.count.buildingIdInDistrictIds(
		$state.citySlots,
		BuildingEnumSchema.Values.lumberjack,
		conditionAppliesToCityDistrictIds
	);

	// Count the trees in each relevant cityDistrictIds
	const treesInRelevantCityDistrictIds = helpers.count.buildingIdInDistrictIds(
		$state.citySlots,
		BuildingEnumSchema.Values.tree,
		conditionAppliesToCityDistrictIds
	);

	// For each Lumberjack we receive as much Wood as many building slots in the same district with a tree in it
	let payout = 0;
	payout = lumberjacksInRelevantCityDistrictIds * treesInRelevantCityDistrictIds;

	// Check if we unlocked IMPROVED WOODAXE
	const hasImprovedWoodaxe = $state.unlockedAdvancements.includes(
		AdvancementEnumSchema.Values.improvedWoodaxe
	);

	// If so, each Lumberjack produces 1 wood more
	if (hasImprovedWoodaxe) payout += lumberjacksInRelevantCityDistrictIds;

	// Calculate how much this means in terms of takehome
	const newWoodValue = helpers.add.resource($state.wood, payout);

	// Pass our new value to update the state
	const handleNext = () =>
		state.updateState(
			{
				// Return the new wood value for our rest object to update the state, adding an additional 5 if we selected a tree
				wood: helpers.add.resource(
					$state.wood,
					newWoodValue + (!!$highlightCityDistrictSlotIndexes.length ? 5 : 0)
				),
				// If relevant, return the new cityDistrict value
				...($highlightCityDistrictSlotIndexes.length
					? {
							citySlots: helpers.remove.cityDistrictSlot(
								$state.citySlots,
								$highlightCityDistrictSlotIndexes[0]
							)
					  }
					: {}),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if conditionAppliesToCityDistrictIds.length}
	<Message>
		You have {helpers.text.addS(
			lumberjacksInRelevantCityDistrictIds,
			BuildingEnumSchema.Values.lumberjack
		)} and {helpers.text.addS(treesInRelevantCityDistrictIds, BuildingEnumSchema.Values.tree)} in the
		same {helpers.text.addS(conditionAppliesToCityDistrictIds.length, 'district')}. Therefore, you
		will get {helpers.text.addS(payout, ResourceEnumSchema.Values.wood)}. Since you currently have {$state.wood}
		this will get you to {newWoodValue}.
	</Message>

	{#if hasImprovedWoodaxe}
		<Message
			>Since you have unlocked {helpers.get.advancementById(
				AdvancementEnumSchema.Values.improvedWoodaxe
			).name}, each {helpers.get.buildingById(BuildingEnumSchema.Values.lumberjack).name} produces 1
			{helpers.get.resourceById(ResourceEnumSchema.Values.wood).name} more.</Message
		>
	{/if}
{:else}
	<Message>
		You do not have Lumberjacks and trees in the same districts, so nothing happens.
	</Message>
{/if}

{#if $highlightCityDistrictSlotIndexes.length}
	<Message
		>You selected a Tree. This will be destroyed and you will get an additional +5 wood.</Message
	>
{/if}

<Button pulse={true} handleClick={handleNext}>Next</Button>
