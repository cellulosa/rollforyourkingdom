<script lang="ts">
	import { state, pulseCityDistrictIds, highlightCityDistrictSlotIndexes } from '$lib/stores';
	import { defaults } from '$lib/game/defaults';
	import { helpers } from '$lib/game/helpers';
	import BuildModal from '$lib/components/modals/BuildModal.svelte';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { CityDistrictEnumSchema, type CityDistrictEnumType, type State } from '$lib/zod';
	import BuildingCard from '$lib/components/cards/BuildingCard.svelte';
	import { buildings, type BuildingType } from '$lib/game/buildings';
	import Building from '$lib/components/ui/Building.svelte';

	let selectedBuilding: BuildingType;
	let isModalOpen = false;
	let haveEnoughResources: boolean;
	let canBuildOnDistrictIds: CityDistrictEnumType[];
	let maxedOutBuildPerTurn: boolean;

	// Check if we did not hit the max build amount per turn
	$: maxedOutBuildPerTurn = $state.built.length === defaults.buildUpTo;

	// Handle dispatcher
	export const citySlotClicked = (event: CustomEvent<number>) => {
		isModalOpen = true;
		$highlightCityDistrictSlotIndexes = [event.detail];
	};

	// Fucntion to check if we have enough resources to build a building
	const checkHaveEnoughResources = (
		state: State,
		cost: {
			wood?: State['wood'];
			food?: State['food'];
			gold?: State['gold'];
		}
	) => {
		if (cost.wood && state.wood < cost.wood) return false;
		if (cost.food && state.food < cost.food) return false;
		if (cost.gold && state.gold < cost.gold) return false;

		return true;
	};

	// Move to the next action
	const handleClick = () =>
		state.updateState(
			{
				action: helpers.get.actionById($state.action).next
			},
			$state
		);

	// Handle building selection
	const handleSelect = (building: BuildingType) => {
		// Set the selected building
		selectedBuilding = building;

		// No need to continue if we maxed out our limit of builds allowed per turn
		if (maxedOutBuildPerTurn) return;

		// Check if we have enough resources to build it
		haveEnoughResources = checkHaveEnoughResources($state, building.cost);

		// If we can only build one per districts, check in which cityDistrictIds we can still build one
		if (building.onePerDistrict) {
			canBuildOnDistrictIds = helpers.find.cityDistrictIds.withoutBuildingId(
				building.id,
				$state.citySlots
			);
		} else if (building?.buildOnlyOn) {
			// If the building can only be built in certain districts, pulsate only these
			canBuildOnDistrictIds = building.buildOnlyOn;
		} else {
			// Otherwise it means we can build it everywhere
			canBuildOnDistrictIds = [...Object.values(CityDistrictEnumSchema.Values)];
		}

		// Finally highlight thsoe districts where we can build it (provided we have enough resources)
		if (haveEnoughResources) $pulseCityDistrictIds = canBuildOnDistrictIds;
	};
</script>

{#if !maxedOutBuildPerTurn}
	<Message>
		You can still build {helpers.text.addS(defaults.buildUpTo - $state.built.length, 'building')}.
		Click on a building to see its details; then the city slot where you want to build it.
	</Message>

	<div class="grid grid-cols-7 gap-1 my-2">
		{#each buildings as building}
			{#if helpers.is.aBuilding(building.id)}
				<button
					class="btn p-2 h-auto"
					class:text-neutral={selectedBuilding?.id === building.id}
					class:bg-accent={selectedBuilding?.id === building.id}
					class:hover:bg-accent-focus={selectedBuilding?.id === building.id}
					on:click={() => handleSelect(building)}
				>
					<span><Building buildingId={building.id} /></span>
					<p>{building.name}</p>
				</button>
			{/if}
		{/each}
	</div>

	{#if helpers.is.aBuilding(selectedBuilding?.id)}
		{#key selectedBuilding.id}
			<BuildingCard building={selectedBuilding} />
		{/key}

		{#if $highlightCityDistrictSlotIndexes.length}
			<BuildModal
				bind:building={selectedBuilding}
				bind:haveEnoughResources
				bind:canBuildOnDistrictIds
				{maxedOutBuildPerTurn}
				bind:isModalOpen
			/>
		{/if}
	{/if}
{:else}
	<Message>All done, you must pass now.</Message>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
