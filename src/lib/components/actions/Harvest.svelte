<script lang="ts">
	import { state, highlightBuildingIds } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { AdvancementEnumSchema, BuildingEnumSchema, ResourceEnumSchema } from '$lib/zod';

	// Let's count how many farms we have
	const countFarmsInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.farm
	);

	// If there are any, highlight all farms
	if (countFarmsInCitySlots > 0) $highlightBuildingIds = [BuildingEnumSchema.Values.farm];

	// Get the current season multiplier
	const seasonMultiplier = helpers.game.seasonMultiplier($state.turn);

	// And Calculate the payout
	let payout = 0;
	payout = countFarmsInCitySlots * seasonMultiplier;

	// Check if we unlocked CROP ROTATION
	const hasCropRotation = $state.unlockedAdvancements.includes(
		AdvancementEnumSchema.Values.cropRotation
	);

	// If we do, each Farm produces 1 food more
	if (hasCropRotation) payout += countFarmsInCitySlots;

	// Calculate the new good value
	const newFoodValue = helpers.add.resource($state.food, payout);

	// Pass our new value to update the state
	const handleClick = () =>
		state.updateState(
			{
				// If relevant, pass the new food value
				...(countFarmsInCitySlots > 0 ? { food: newFoodValue } : {}),
				// Move to the next action
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

<Message>
	You have {helpers.text.addS(countFarmsInCitySlots, BuildingEnumSchema.Values.farm)} and the current
	season multiplier is {seasonMultiplier}, so you will get {helpers.text.addS(
		payout,
		ResourceEnumSchema.Values.food
	)}. Since you currently have {$state.food}, this will get you to {newFoodValue}.
</Message>

{#if hasCropRotation}
	<Message>
		Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.cropRotation)
			.name}, each {helpers.get.buildingById(BuildingEnumSchema.Values.farm).name} produces 1
		{helpers.get.resourceById(ResourceEnumSchema.Values.food).name} more.</Message
	>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
