<script lang="ts">
	import { state } from '$lib/stores';
	import CitySlot from '$lib/components/slots/CitySlot.svelte';
	import { AdvancementEnumSchema, CityDistrictEnumSchema } from '$lib/zod';
	import CityDistrict from '$lib/components/ui/CityDistrict.svelte';

	// Pass the dispatcher
	export let citySlotClicked: (event: CustomEvent<number>) => void;

	// Check if we unlocked MASONRY
	let hasMasonry = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.masonry);
</script>

<h2 class="text-2xl font-bold">City</h2>

<div class="grid grid-cols-5 gap-1">
	{#key $state.citySlots[4]}
		<CitySlot index={4} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[5]}
		<CitySlot index={5} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[6]}
		<CitySlot index={6} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[10]}
		<CitySlot index={10} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[11]}
		<CitySlot index={11} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}

	{#key $state.citySlots[7]}
		<CitySlot index={7} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[8]}
		<CitySlot index={8} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[12]}
		<CitySlot index={12} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[13]}
		<CitySlot index={13} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[16]}
		<CitySlot index={16} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[9]}
		<CitySlot index={9} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}

	{#key $state.citySlots[0]}
		<CitySlot index={0} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[1]}
		<CitySlot index={1} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[14]}
		<CitySlot index={14} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[15]}
		<CitySlot index={15} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[17]}
		<CitySlot index={17} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[2]}
		<CitySlot index={2} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}

	{#key $state.citySlots[3]}
		<CitySlot index={3} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[18]}
		<CitySlot index={18} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[19]}
		<CitySlot index={19} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}

	{#key $state.citySlots[20]}
		<CitySlot index={20} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}

	{#key $state.citySlots[21]}
		<CitySlot index={21} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[22]}
		<CitySlot index={22} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[23]}
		<CitySlot index={23} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
	{#key $state.citySlots[24]}
		<CitySlot index={24} on:citySlotClicked={citySlotClicked} {hasMasonry} />
	{/key}
</div>

<div class="my-3 text-center">
	{#each Object.values(CityDistrictEnumSchema.Values) as cityDistrictId}
		<CityDistrict {cityDistrictId} />
	{/each}
</div>
