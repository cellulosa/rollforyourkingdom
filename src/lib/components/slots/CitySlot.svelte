<script lang="ts">
	import {
		state,
		highlightBuildingIds,
		pulseBuildingIds,
		pulseCityDistrictIds,
		pulseCityDistrictSlotIndex,
		highlightCityDistrictSlotIndexes
	} from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { createEventDispatcher } from 'svelte';
	import Building from '$lib/components/ui/Building.svelte';
	import { z } from 'zod';

	// Our component prop with the citySlot[] index
	export let index: number;

	// We know from the parent (so we query only once) whether we unlocked MASONRY
	export let hasMasonry: boolean;

	// Set the current cityDistrict from the slot index number
	const cityDistrictId = helpers.find.cityDistrictId.fromSlotIndex(index);

	// Dispatch city slot clicked
	const dispatch = createEventDispatcher<{ citySlotClicked: number }>();
	const handleClick = () => dispatch('citySlotClicked', index);

	// Set current building object
	const building = helpers.get.buildingById($state.citySlots[index]);

	// Set tooltip value
	let tooltip = building.name;
	// Add HitPoints if relevant
	if (z.number().positive().safeParse(building.hitPoints).success)
		// If we unlocked MASONRY, all buildings have 1 Hit Point more
		tooltip += ` (${building.hitPoints + Number(hasMasonry)} HP)`;
</script>

<button
	class="btn p-0 h-24 place-items-center"
	class:bg-fuchsia-400={cityDistrictId === 'hightown'}
	class:hover:bg-fuchsia-600={cityDistrictId === 'hightown'}
	class:text-fuchsia-800={cityDistrictId === 'hightown'}
	class:border-fuchsia-800={cityDistrictId === 'hightown'}
	class:bg-emerald-400={cityDistrictId === 'mountainside'}
	class:hover:bg-emerald-600={cityDistrictId === 'mountainside'}
	class:text-emerald-800={cityDistrictId === 'mountainside'}
	class:border-emerald-800={cityDistrictId === 'mountainside'}
	class:bg-lime-400={cityDistrictId === 'theGrove'}
	class:hover:bg-lime-600={cityDistrictId === 'theGrove'}
	class:text-lime-800={cityDistrictId === 'theGrove'}
	class:border-lime-800={cityDistrictId === 'theGrove'}
	class:bg-indigo-400={cityDistrictId === 'countryDistrict'}
	class:hover:bg-indigo-600={cityDistrictId === 'countryDistrict'}
	class:text-indigo-800={cityDistrictId === 'countryDistrict'}
	class:border-indigo-800={cityDistrictId === 'countryDistrict'}
	class:text-white={$highlightCityDistrictSlotIndexes.includes(index) ||
		$highlightBuildingIds.includes($state.citySlots[index])}
	class:border-white={$highlightCityDistrictSlotIndexes.includes(index) ||
		$highlightBuildingIds.includes($state.citySlots[index])}
	class:animate-pulse={// Pulse if ...
	// This building is included in the pulseBuildingIds array
	($pulseBuildingIds.includes($state.citySlots[index]) ||
		// Or if we want to pulse the whole district
		$pulseCityDistrictIds.includes(helpers.find.cityDistrictId.fromSlotIndex(index)) ||
		// Or if we want to pulse this specific slot
		$pulseCityDistrictSlotIndex.includes(index)) &&
		// And we did not click it (in which case we stop the pulsation)
		!$highlightCityDistrictSlotIndexes.includes(index)}
	on:click={handleClick}
>
	{#if !helpers.is.emptySlot(building.id)}
		<div class="tooltip tooltip-bottom p-2" data-tip={tooltip}>
			<Building buildingId={building.id} />
		</div>
	{/if}
</button>
