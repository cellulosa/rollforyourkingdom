<script lang="ts">
	import { state, highlightCityDistrictSlotIndexes } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import {
		type BuildingEnumType,
		type ResourceEnumType,
		type CityDistrictEnumType,
		BuildingEnumSchema
	} from '$lib/zod';
	import type { BuildingType } from '$lib/game/buildings';

	export let building: BuildingType;
	export let isModalOpen = false;
	export let haveEnoughResources: boolean;
	export let canBuildOnDistrictIds: CityDistrictEnumType[];
	export let maxedOutBuildPerTurn: boolean;

	const handleClick = () => {
		// We should not do anything unless we have all the required info
		if (!building || !$highlightCityDistrictSlotIndexes.length) return;

		// Do not continue unless we have enough resource to build this building
		if (!haveEnoughResources) return;

		// Or if we selected a district where we cannot build
		if (
			!canBuildOnDistrictIds.includes(
				helpers.find.cityDistrictId.fromSlotIndex($highlightCityDistrictSlotIndexes[0])
			)
		)
			return;

		// Or if we already built the maximum amount per round
		if (maxedOutBuildPerTurn) return;

		// If all is good we can update the state
		state.updateState(
			{
				// Update resources accordingly to what we need to pay
				...Object.entries(building.cost).reduce(
					(
						result: {
							[key in ResourceEnumType]?: number;
						},
						[resourceId, cost]
					) =>
						cost > 0
							? {
									...result,
									[resourceId as ResourceEnumType]: helpers.remove.resource(
										$state[resourceId as ResourceEnumType],
										cost +
											// If this is a non-empty slot, we need to deduct -2 food in addition
											(resourceId === 'food' ? 2 : 0)
									)
							  }
							: result,
					{}
				),
				// Push the item on an array so that we can keep track of what has been built on this turn
				built: [...$state.built, building.id as BuildingEnumType],
				citySlots: helpers.add.cityDistrictSlot(building.id, $state.citySlots, [
					$highlightCityDistrictSlotIndexes[0]
				])
			},
			$state
		);

		// After the state update we can reset the state
		cancel();
	};

	// Reset state
	const cancel = () => {
		building = helpers.get.buildingById(BuildingEnumSchema.Values.none);
		isModalOpen = false;
		haveEnoughResources = false;
		canBuildOnDistrictIds = [];
	};
</script>

<div class="modal modal-bottom sm:modal-middle" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<p class="py-4">
			{#if haveEnoughResources && canBuildOnDistrictIds && !maxedOutBuildPerTurn}
				You are going to build {building.name} on {helpers.get.cityDistrictById(
					helpers.find.cityDistrictId.fromSlotIndex($highlightCityDistrictSlotIndexes[0])
				).name}. This will cost you {helpers.text.commaSeparatedlist(
					Object.entries(building.cost).reduce(
						(result, [resourceId, cost]) =>
							cost > 0 ? [...result, helpers.text.addS(cost, resourceId)] : result,
						[]
					)
				)}{#if !helpers.is.emptySlot($state.citySlots[$highlightCityDistrictSlotIndexes[0]])}, plus
					2 Food since you selected an occupied slot{/if}.
			{:else}
				You cannot build {building.name} because you either lack the resources to do so or have already
				reached the maximum amount of builds for this turn.
			{/if}
		</p>
		<div class="modal-action">
			{#if haveEnoughResources && canBuildOnDistrictIds && !maxedOutBuildPerTurn}
				<button class="btn btn-success" on:click={handleClick}>Build!</button>
			{/if}
			<button class="btn btn-error" on:click={cancel}>Cancel</button>
		</div>
	</div>
</div>
