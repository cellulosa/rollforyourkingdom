<script lang="ts">
	import { highlightBuildingIds, state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { advancements, type AdvancementType } from '$lib/game/advancements';
	import AdvancementCard from '$lib/components/cards/AdvancementCard.svelte';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { BuildingEnumSchema } from '$lib/zod';

	let selectedAdvancement: AdvancementType | undefined = undefined;

	// Count how many abbeys we have in the city
	const countAbbeysInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.abbey
	);

	// If we found at least one abbey
	let canResearch = false;
	if (countAbbeysInCitySlots > 0) {
		// Highlight all abbeys in the city
		$highlightBuildingIds = [BuildingEnumSchema.Values.abbey];

		// allow research
		canResearch = true;
	}

	// Handle advancement selection
	let canUnlock = false;
	const handleSelect = (advancement: AdvancementType) => {
		// Set the selected building
		selectedAdvancement = advancement;

		// Allow to unlock this achievement if
		canUnlock =
			// we haven't unlocked this advancement already
			!$state.unlockedAdvancements.includes(advancement.id) &&
			// If we have the required amount of buildings (if applicable)
			(!advancement.requresBuildingId ||
				helpers.count.buildingIdInCitySlots($state.citySlots, advancement.requresBuildingId) >=
					(advancement.min ?? 0)) &&
			// We unlocked a pre-required advancement (if applicable)
			(!advancement.requresAdvancement ||
				$state.unlockedAdvancements.includes(advancement.requresAdvancement)) &&
			// We have enough gold
			$state.gold >= advancement.cost;
	};

	// Pass our new value to update the state
	const handleClick = () =>
		state.updateState(
			{
				// If the action is eligible and we selected an eligible advancement, we add add it to our state
				...(canResearch && selectedAdvancement && canUnlock
					? {
							unlockedAdvancements: [...$state.unlockedAdvancements, selectedAdvancement.id],
							gold: helpers.remove.resource($state.gold, selectedAdvancement.cost)
					  }
					: {}),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if canResearch}
	<Message>Since you have at least one abbey you can unlock a new Advancement!</Message>

	<div class="grid grid-cols-6 gap-1 my-2">
		{#each advancements as advancement}
			<button
				class="btn p-2 h-auto"
				class:text-neutral={selectedAdvancement?.id === advancement.id}
				class:bg-accent={selectedAdvancement?.id === advancement.id}
				class:hover:bg-accent-focus={selectedAdvancement?.id === advancement.id}
				on:click={() => handleSelect(advancement)}
			>
				<p>{advancement.name}</p>
			</button>
		{/each}
	</div>

	{#if selectedAdvancement}
		{#key selectedAdvancement.id}
			<AdvancementCard advancement={selectedAdvancement} />
		{/key}
	{/if}
{:else}
	<Message>You do not have any abbeys, so you cannot unlock any new achievement.</Message>
{/if}

{#if selectedAdvancement}
	<Button pulse={canUnlock} {handleClick}>Unlock {selectedAdvancement.name}</Button>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
