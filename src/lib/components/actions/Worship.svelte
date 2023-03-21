<script lang="ts">
	import { state, highlightBuildingIds } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { z } from 'zod';
	import { BuildingEnumSchema, ResourceEnumSchema } from '$lib/zod';

	// Find where there are abbeys
	const abbeysInCitySlots = helpers.find.cityDistrictSlotIndexes.withBuildingId.inCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.abbey
	);

	// If we found abbeys, highlight them
	if (abbeysInCitySlots.length > 0) $highlightBuildingIds = [BuildingEnumSchema.Values.abbey];

	// Iterate this array to find if within each of these districts we have at least a Castle, a Market or a Tavern
	const payout = abbeysInCitySlots.reduce((result, slotIndex) => {
		// Find the respective cityDistrictId
		const cityDistrictId = helpers.find.cityDistrictId.fromSlotIndex(slotIndex);

		// Now search within that district for either a castle, market or tavern
		const hasCastleOrMarketOrTavern =
			helpers.count.buildingIdInDistrictId(
				$state.citySlots,
				BuildingEnumSchema.Values.castle,
				cityDistrictId
			) > 0 ||
			helpers.count.buildingIdInDistrictId(
				$state.citySlots,
				BuildingEnumSchema.Values.market,
				cityDistrictId
			) > 0 ||
			helpers.count.buildingIdInDistrictId(
				$state.citySlots,
				BuildingEnumSchema.Values.tavern,
				cityDistrictId
			) > 0;

		// If we found it, add 1 to our payout
		return hasCastleOrMarketOrTavern ? result + 1 : result;
	}, 0);

	// Pass our new value to update the state
	const handleClick = () =>
		state.updateState(
			{
				// If the condition is applicable
				...(z.number().positive().safeParse(payout).success
					? {
							gold: helpers.add.resource($state.gold, payout)
					  }
					: {}),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

<Message>
	{#if payout > 0}
		You have {helpers.text.addS(abbeysInCitySlots.length, BuildingEnumSchema.Values.abbey)} within districts
		with at least a castle, market or tavern.. Therefore, you are entitled to {helpers.text.addS(
			payout,
			ResourceEnumSchema.Values.gold
		)}.
	{:else}
		You do not have Abbeys in districts with at least a Castle, a Market or a Tavern, so the
		condition does not apply to you.
	{/if}
</Message>

<Button pulse={true} {handleClick}>Next</Button>
