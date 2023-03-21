<script lang="ts">
	import { state } from '$lib/stores';
	import DieSlot from '$lib/components/slots/DieSlot.svelte';
	import Die from '$lib/components/ui/Die.svelte';
	import { helpers } from '$lib/game/helpers';
	import { ActionEnumSchema } from '$lib/zod';

	// Keep an update die slot reserve
	const dice = helpers.dice.format($state.dice);

	// Pass back to our parent the selected die (based on the current action being played)
	// We use the Nullish coalescing operator to treat 0 as a number (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
	export let selectedDie: number | undefined =
		dice?.full.find(({ die }) => die === helpers.find.dieFromAction($state.action))?.index ??
		undefined;

	// Dispatcher that handles dice selection
	const dieSlotClicked = (event: CustomEvent<number>) => {
		// We should allow die selection only in the playDie action
		if ($state.action !== ActionEnumSchema.Values.playDie) return;

		selectedDie = event.detail;
	};
</script>

<div>
	<h2 class="text-2xl font-bold">Dice reserve</h2>

	<div class="group">
		{#each dice.set as { die, index }}
			<DieSlot on:dieSlotClicked={dieSlotClicked} {die} {index} {selectedDie} />
		{/each}
	</div>

	{#if dice.remaining.length}
		<div class="group">
			{#each dice.remaining as { die }}
				<button class="btn p-0 h-16 w-16 place-items-center" disabled>
					<Die {die} />
				</button>
			{/each}
		</div>
	{/if}
</div>
