<script lang="ts">
	import { state } from '$lib/stores';
	import { ActionEnumSchema, type DieEnumType } from '$lib/zod';
	import { createEventDispatcher } from 'svelte';
	import Die from '$lib/components/ui/Die.svelte';

	export let die: DieEnumType;
	export let index: number;
	export let selectedDie: number | undefined;

	// Dispatch die slot clicked
	const dispatch = createEventDispatcher<{ dieSlotClicked: number }>();
	const handleClick = () => dispatch('dieSlotClicked', index);
</script>

<button
	on:click={handleClick}
	class="btn p-0 h-16 w-16 place-items-center"
	class:text-neutral={selectedDie === index}
	class:bg-accent={selectedDie === index}
	class:hover:bg-accent-focus={selectedDie === index}
	class:animate-pulse={$state.action === ActionEnumSchema.Values.playDie &&
		!($state.playedDice.includes(die) && selectedDie !== index)}
	disabled={$state.playedDice.includes(die) && selectedDie !== index}
>
	<Die {die} />
</button>
