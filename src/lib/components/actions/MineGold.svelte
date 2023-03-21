<script lang="ts">
	import { state, highlightBuildingIds } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { AdvancementEnumSchema, BuildingEnumSchema, ResourceEnumSchema } from '$lib/zod';

	// Count how many quarrys we have
	const countQuarrysInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.quarry
	);

	// If there are any, highlight all quarrys
	if (countQuarrysInCitySlots > 0) $highlightBuildingIds = [BuildingEnumSchema.Values.quarry];

	// Calculate our payout
	let payout = 0;
	payout = countQuarrysInCitySlots;

	// Check if we unlocked SMELTING
	const hasSmelting = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.smelting);

	// If so, each Quarry produces 1 gold more
	if (hasSmelting) payout += countQuarrysInCitySlots;

	// And therefore our new gold value
	const newGoldValue = helpers.add.resource($state.gold, payout);

	// Pass our new value to update the state
	const handleClick = () =>
		state.updateState(
			{
				// If relevant, pass the new gold value
				...(countQuarrysInCitySlots > 0 ? { gold: newGoldValue } : {}),
				// Move to the next action
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if countQuarrysInCitySlots > 0}
	<Message>
		You have {helpers.text.addS(countQuarrysInCitySlots, BuildingEnumSchema.Values.quarry)}, so you
		will get {helpers.text.addS(countQuarrysInCitySlots, ResourceEnumSchema.Values.gold)}. Since you
		currently have {$state.gold}, this will get you to {payout}.
	</Message>

	{#if hasSmelting}
		<Message
			>Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.smelting)
				.name}, each {helpers.get.buildingById(BuildingEnumSchema.Values.quarry).name} produces 1
			{helpers.get.resourceById(ResourceEnumSchema.Values.gold).name} more.</Message
		>
	{/if}
{:else}
	<Message>
		Since you have no {helpers.get.buildingById(BuildingEnumSchema.Values.quarry)}, you will not get
		any {helpers.get.resourceById(ResourceEnumSchema.Values.gold)}.
	</Message>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
