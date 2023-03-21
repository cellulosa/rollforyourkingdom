<script lang="ts">
	import { state } from '$lib/stores';
	import {
		DieEnumSchema,
		DieReRolledOrChangedSchema,
		type DieEnumType,
		type DieReRolledOrChangedType
	} from '$lib/zod';
	import { z } from 'zod';
	import Die from '$lib/components/ui/Die.svelte';

	export let reRollOrChange: { id: number; die: DieEnumType }[];
	export let changeTo: DieEnumType;
	export let isModalOpen: boolean = false;
	export let handleClick: () => void;
	export let dieReRolledOrChanged: DieReRolledOrChangedType;
</script>

{#if reRollOrChange.length && z.number().safeParse(reRollOrChange[0].id).success}
	<div class="modal modal-bottom sm:modal-middle" class:modal-open={isModalOpen}>
		<div class="modal-box">
			<h3 class="text-1xl font-bold mb-4">
				Change the <strong class="uppercase">{$state.dice[reRollOrChange[0].id]}</strong> into...
			</h3>
			<div class="mt-6 flex gap-2">
				{#each Object.values(DieEnumSchema.Values).filter((side) => side !== $state.dice[reRollOrChange[0].id]) as side}
					<button
						class="btn p-0 h-16 w-16"
						class:text-neutral={side === changeTo}
						class:bg-accent={side === changeTo}
						class:hover:bg-accent-focus={side === changeTo}
						on:click={() => (changeTo = side)}
					>
						<Die die={side} /></button
					>
				{/each}
			</div>
			<div class="modal-action">
				<button
					class="btn btn-success"
					class:btn-disabled={!changeTo}
					on:click={() => {
						dieReRolledOrChanged = DieReRolledOrChangedSchema.Values.changed;
						handleClick();
					}}>Change die</button
				>
				<button class="btn btn-error" on:click={() => (isModalOpen = false)}>Cancel</button>
			</div>
		</div>
	</div>
{/if}
