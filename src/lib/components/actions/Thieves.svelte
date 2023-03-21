<script lang="ts">
	import {
		state,
		highlightResourceIds,
		highlightCityDistrictIds,
		pulseResourceIds
	} from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		AdvancementEnumSchema,
		BuildingEnumSchema,
		ResourceEnumSchema,
		type CityDistrictEnumType,
		type ResourceEnumType
	} from '$lib/zod';

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
	const isThieves = conditionAppliesToCityDistrictIds.length > 0;

	// If the condition applies
	if (isThieves) {
		// we highlight the slots of the cityDistricts to which the condition applies
		$highlightCityDistrictIds = conditionAppliesToCityDistrictIds;

		// Pulsate all resources
		$pulseResourceIds = Object.values(ResourceEnumSchema.Values);
	}

	// ignore the Riot event if we unlocked GUILD OF THIEVES until we have at least 1 market
	const hasGuildOfThieves = $state.unlockedAdvancements.includes(
		AdvancementEnumSchema.Values.guildOfThieves
	);
	let countMarketsInCityslots: number = 0;
	let canIgnore = false;
	if (hasGuildOfThieves)
		countMarketsInCityslots = helpers.count.buildingIdInCitySlots(
			$state.citySlots,
			BuildingEnumSchema.Values.market
		);
	if (hasGuildOfThieves && countMarketsInCityslots < 1) canIgnore = true;

	const pay = (cityDistrictIds: CityDistrictEnumType[], resourceIds: ResourceEnumType[]) => {
		const result: {
			[key in ResourceEnumType]?: number;
		} = {};

		resourceIds.forEach(
			(resourceId) =>
				(result[resourceId] = {
					[ResourceEnumSchema.Values.gold]: (1 * cityDistrictIds.length) / resourceIds.length,
					[ResourceEnumSchema.Values.wood]: (2 * cityDistrictIds.length) / resourceIds.length,
					[ResourceEnumSchema.Values.food]: (3 * cityDistrictIds.length) / resourceIds.length
				}[resourceId])
		);

		return result;
	};

	// Event triggered when we click on a resource slot
	export const resourceSlotClicked = (event: CustomEvent<ResourceEnumType>) => {
		// No need to continue unless there is a thieves attack happening
		if (!isThieves) return;

		// Do not continue if we already selected a number of resources that equals to the number of districts to which the condition apply
		if ($highlightResourceIds.length === conditionAppliesToCityDistrictIds.length) return;

		// Allow to select multiple resources
		$highlightResourceIds = [...new Set([...$highlightResourceIds, event.detail])];
	};

	const handleClick = () =>
		state.updateState(
			{
				// If the thieves condition is applicable
				...(isThieves && !canIgnore
					? {
							// Calculate the new resource values based on user selection
							...Object.entries(
								pay(conditionAppliesToCityDistrictIds, $highlightResourceIds)
							).reduce(
								(result, [resourceId, amount]) => ({
									...result,
									[resourceId]: helpers.remove.resource(
										$state[resourceId as ResourceEnumType],
										amount
									)
								}),
								{}
							)
					  }
					: // If the thieves condition is not applicable, just move to the next action
					  {}),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if canIgnore}
	<Message>
		Since you have unlocked {helpers.get.advancementById(
			AdvancementEnumSchema.Values.guildOfThieves
		).name} and do not have any market, you can ignore this action.
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
			but no market.
		{:else}
			all of which are without a market.
		{/if}
		Therefore, {#if conditionAppliesToCityDistrictIds.length > 1}for each{/if} you must either pay 1
		Gold, 2 Woods or 3 Foods. Select now a resource.
	</Message>

	{#if $highlightResourceIds.length}
		<Message
			>You are goign to pay
			{helpers.text.commaSeparatedlist(
				Object.entries(pay(conditionAppliesToCityDistrictIds, $highlightResourceIds)).map(
					([resourceId, amount]) => helpers.text.addS(amount, resourceId)
				)
			)}.
		</Message>
	{/if}
{:else}
	<Message>
		You have no district with 4 or more buildings but no Market, so nothing to do here.
	</Message>
{/if}

<Button pulse={isThieves ? !!$highlightResourceIds.length : true} {handleClick}>Next</Button>
