<script lang="ts">
	import { state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import CityDistrict from '$lib/components/ui/CityDistrict.svelte';
	import type { BuildingType } from '$lib/game/buildings';

	export let building: BuildingType;

	// Count how many we already have in da city
	const countBuildingInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		building.id
	);
</script>

<div class="card bg-base-100 shadow-xl my-2">
	<div class="card-body">
		<h2 class="card-title">{building.name}</h2>
		{#if building?.buildOnlyOn}
			<p>
				Can only be built on: {#each building.buildOnlyOn as cityDistrictId}
					<CityDistrict {cityDistrictId} />
				{/each}
			</p>
		{/if}

		{#if building?.onePerDistrict}
			<p>Can only build one per district.</p>
		{/if}

		<p>HitPoints: {building.hitPoints}</p>
		<p>
			Costs: {helpers.text.commaSeparatedlist(
				Object.entries(building.cost).reduce(
					(result, [buildingId, cost]) =>
						cost > 0 ? [...result, helpers.text.addS(cost, buildingId)] : result,
					[]
				)
			)}
		</p>
		{#if building.produces}
			<p>
				Produces: {helpers.get.resourceById(building.produces).name}
			</p>
		{/if}
		{#if building.consumes}
			<p>
				Consumes: {helpers.get.resourceById(building.consumes).name}
			</p>
		{/if}
		{#if building.allows.length > 0}
			<p>
				Allows:

				{helpers.text.commaSeparatedlist(building.allows)}
			</p>
		{/if}

		{#if countBuildingInCitySlots > 0}
			<p>You already have: {countBuildingInCitySlots}</p>
		{/if}
	</div>
</div>
