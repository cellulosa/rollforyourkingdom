<script lang="ts">
	import { state, pulseResourceIds, highlightResourceIds } from '$lib/stores';
	import type { ResourceEnumType } from '$lib/zod';
	import { helpers } from '$lib/game/helpers';
	import { createEventDispatcher } from 'svelte';
	import Resource from '$lib/components/ui/Resource.svelte';

	// Our component prop with the Resource object
	export let resourceId: ResourceEnumType;

	// Dispatch resource slot clicked
	const dispatch = createEventDispatcher<{ resourceSlotClicked: ResourceEnumType }>();
	const handleClick = () => dispatch('resourceSlotClicked', resourceId);
</script>

<button
	class="btn w-28 h-28 place-items-center"
	class:text-white={$highlightResourceIds.includes(resourceId)}
	class:border-white={$highlightResourceIds.includes(resourceId)}
	class:animate-pulse={// Pulse if we include this resourceId
	$pulseResourceIds.includes(resourceId) &&
		// Provided we haven't selected it
		!$highlightResourceIds.includes(resourceId)}
	on:click={handleClick}
>
	<span class="countdown text-6xl">
		<span style="--value:{$state[resourceId]};" />
	</span>
	<div class="h-5 w-5 mr-1">
		<Resource {resourceId} />
	</div>
	<p>
		{helpers.get.resourceById(resourceId).name}
	</p>
</button>
