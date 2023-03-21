<script lang="ts">
	import { helpers } from '$lib/game/helpers';
	import type { AdvancementType } from '$lib/game/advancements';
	import { ResourceEnumSchema } from '$lib/zod';

	export let advancement: AdvancementType;
</script>

<div class="card bg-base-100 shadow-xl my-2">
	<div class="card-body">
		<h2 class="card-title mt-0">{advancement.name}</h2>

		<p>Cost: {helpers.text.addS(advancement.cost, ResourceEnumSchema.Values.gold)}</p>

		<p>
			Prerequisite:
			{#if advancement.min && advancement.requresBuildingId}
				{helpers.text.addS(advancement.min, advancement.requresBuildingId)}
			{/if}

			{#if advancement.requresAdvancement}
				{helpers.get.advancementById(advancement.requresAdvancement).name} achievement
			{/if}
		</p>

		<p>
			Effect: {advancement.effect}
		</p>
	</div>
</div>
