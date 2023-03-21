<script lang="ts">
	import { state } from '$lib/stores';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ChangeDieModal from '$lib/components/modals/ChangeDieModal.svelte';
	import { helpers } from '$lib/game/helpers';
	import {
		ActionEnumSchema,
		AdvancementEnumSchema,
		DieReRolledOrChangedSchema,
		type DieReRolledOrChangedType,
		type DieEnumType
	} from '$lib/zod';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import ActionsForSelectedDie from '$lib/components/cards/ActionsForSelectedDie.svelte';
	import type { DndEvent } from 'svelte-dnd-action';
	import Die from '$lib/components/ui/Die.svelte';
	import { z } from 'zod';

	const dice: DieEnumType[] = $state.dice;

	// Variable to handle die selection
	let selectedDie: number | undefined = undefined;

	// Prepare two arrays to handle the dragndrop (the starting one, and the one for the drop area)
	let diceReserve = dice.map((die, index) => ({ id: index, die }));
	let reRollOrChange: typeof diceReserve = [];

	// Dragndrop effect duration
	const flipDurationMs = 300;

	// Function fired when a die is moved from the original dice reserve
	const handleDndOrigin = (e: CustomEvent<DndEvent>) =>
		(diceReserve = e.detail.items as typeof diceReserve);

	// Function fired when a die is moved from the drop area
	const handleDndDrop = (e: CustomEvent<DndEvent>) => {
		reRollOrChange = e.detail.items as typeof diceReserve;
	};

	// Variables to manage the one die change
	let changeTo: DieEnumType;
	let isModalOpen = false;

	// Check if we unlocked ASTRONOMY
	const hasAstronomy = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.astronomy);

	// Keep track of whether we rerolled or changed the die, which we will use in the case we unlocked ASTRONOMY
	let dieReRolledOrChanged: DieReRolledOrChangedType;

	// Move to the next stage
	const handleClick = () =>
		state.updateState(
			{
				// If we selected more than one die we re-roll the selected dice
				...(reRollOrChange.length > 1
					? {
							dice: $state.dice.map((die, index) =>
								reRollOrChange.some(({ id }) => id === index) ? helpers.dice.roll() : die
							)
					  }
					: {}),
				// If we selected to change one die
				...(reRollOrChange.length === 1 && changeTo
					? {
							dice: $state.dice.map((die, index) =>
								index === reRollOrChange[0].id ? changeTo : die
							)
					  }
					: {}),
				...// If we unlocked Astronomy, we allow to re-run this action twice
				(hasAstronomy &&
				DieReRolledOrChangedSchema.safeParse(dieReRolledOrChanged).success &&
				!$state.dieReRolledOrChanged
					? {
							action: ActionEnumSchema.Values.reRollOrChangeForAstronomy,
							dieReRolledOrChanged
					  }
					: { action: helpers.get.actionById($state.action).next })
			},
			$state
		);
</script>

{#if hasAstronomy}
	<Message>
		Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.astronomy)
			.name}, now you can reroll some of the dice AND turn one die to a face of your choice.
	</Message>
{:else}
	<Message>
		Now you can either reroll some of the dice OR turn one die to a face of your choice.Oonly
		different die form your dice reserve - double numbers will be discarted.
	</Message>
{/if}

<Message>Drag the dice you want to change or re-roll in the dashed section below.</Message>

{#if selectedDie !== undefined && z.number().nonnegative().safeParse(selectedDie).success}
	<Message>
		{#key selectedDie}
			<ActionsForSelectedDie {selectedDie} />
		{/key}
	</Message>
{/if}

<section
	use:dndzone={{
		items: diceReserve,
		flipDurationMs,
		dropTargetClasses: [],
		dropTargetStyle: {}
	}}
	on:consider={handleDndOrigin}
	on:finalize={handleDndOrigin}
	class="flex-grow min-h-16 rounded-box my-3"
>
	{#each diceReserve as { die, id } (id)}
		<button
			animate:flip={{ duration: flipDurationMs }}
			class="btn p-0 h-16 w-16 place-items-center"
			class:text-neutral={selectedDie === id}
			class:bg-accent={selectedDie === id}
			class:hover:bg-accent-focus={selectedDie === id}
			class:animate-pulse={selectedDie === id}
			on:click={() => (selectedDie = id)}
		>
			<Die {die} />
		</button>
	{/each}
</section>

<div class="flex my-6">
	<section
		use:dndzone={{
			items: reRollOrChange,
			flipDurationMs,
			dropTargetClasses: ['animate-pulse'],
			dropTargetStyle: {}
		}}
		on:consider={handleDndDrop}
		on:finalize={handleDndDrop}
		class="flex-grow justify-center h-24 min-h-full  bg-base-300 rounded-box border-4 border-dashed border-neutral p-3"
	>
		{#each reRollOrChange as { id, die } (id)}
			<button
				animate:flip={{ duration: flipDurationMs }}
				class="btn p-0 h-16 w-16 place-items-center"
				class:text-neutral={selectedDie === id}
				class:bg-accent={selectedDie === id}
				class:hover:bg-accent-focus={selectedDie === id}
				class:animate-pulse={selectedDie === id}
				on:click={() => (selectedDie = id)}
			>
				<Die {die} />
			</button>
		{/each}
	</section>
</div>

<Button
	pulse={(hasAstronomy &&
		$state.dieReRolledOrChanged !== DieReRolledOrChangedSchema.Values.reRolled &&
		reRollOrChange.length > 1) ||
		(!hasAstronomy && reRollOrChange.length > 1)}
	handleClick={() => {
		dieReRolledOrChanged = DieReRolledOrChangedSchema.Values.reRolled;
		handleClick();
	}}
	disabled={reRollOrChange.length <= 1}>Re-roll</Button
>

<Button
	pulse={(hasAstronomy &&
		$state.dieReRolledOrChanged !== DieReRolledOrChangedSchema.Values.changed &&
		reRollOrChange.length === 1) ||
		(!hasAstronomy && reRollOrChange.length === 1)}
	disabled={reRollOrChange.length !== 1}
	handleClick={() => (isModalOpen = true)}>Change face</Button
>

<ChangeDieModal
	bind:changeTo
	bind:isModalOpen
	{reRollOrChange}
	{handleClick}
	bind:dieReRolledOrChanged
/>

<Button pulse={true} {handleClick}>I'm happy with the dice</Button>
