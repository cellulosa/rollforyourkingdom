<script lang="ts">
	import { highlightBuildingIds, state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Helper from '$lib/components/ui/Helper.svelte';
	import { BuildingEnumSchema } from '$lib/zod';

	// Highlight all castles, taverns and abbeys
	$highlightBuildingIds = [
		BuildingEnumSchema.Values.castle,
		BuildingEnumSchema.Values.tavern,
		BuildingEnumSchema.Values.market,
		BuildingEnumSchema.Values.abbey
	];

	// Calculate how many buildings we have
	const castlesInCity = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.castle
	);
	const tavernsInCity = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.tavern
	);
	const marketsInCity = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.market
	);
	const abbeysInCity = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.abbey
	);

	// Calculate what we need to pay to feed the hungry
	const pay = castlesInCity + tavernsInCity + marketsInCity + abbeysInCity;

	// And our final food value
	const totalToPay = helpers.remove.resource($state.food, pay);

	const next = () =>
		state.updateState(
			{
				food: totalToPay,
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

<Message>
	You must <Helper hash={$state.action}>feed the hungry</Helper> now. You have {helpers.text.addS(
		castlesInCity,
		BuildingEnumSchema.Values.castle
	)}, {helpers.text.addS(tavernsInCity, BuildingEnumSchema.Values.tavern)}, {helpers.text.addS(
		marketsInCity,
		BuildingEnumSchema.Values.market
	)} and {helpers.text.addS(abbeysInCity, BuildingEnumSchema.Values.abbey)}. Therefore, you must pay {helpers.text.addS(
		pay,
		'food'
	)} in total. Since you currently have
	{$state.food}, this will get you to {totalToPay}.
</Message>

<button class="btn btn-block animate-pulse" on:click={next}>Pay</button>
