<script lang="ts">
	import { state, pulseEnemyIds, highlightEnemyIds } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { EnemyEnumSchema, type EnemyEnumType } from '$lib/zod';
	import { createEventDispatcher } from 'svelte';

	export let enemyId: EnemyEnumType;

	// Dispatch enemy slot clicked
	const dispatch = createEventDispatcher<{ enemySlotClicked: EnemyEnumType }>();
	const handleClick = () => dispatch('enemySlotClicked', enemyId);
</script>

<button
	class="btn w-28 h-28 place-items-center"
	class:bg-emerald-400={enemyId === EnemyEnumSchema.Values.blackrockClan}
	class:hover:bg-emerald-600={enemyId === EnemyEnumSchema.Values.blackrockClan}
	class:text-emerald-800={enemyId === EnemyEnumSchema.Values.blackrockClan}
	class:border-emerald-800={enemyId === EnemyEnumSchema.Values.blackrockClan}
	class:bg-emerald-600={enemyId === EnemyEnumSchema.Values.blackrockClan &&
		$highlightEnemyIds.includes(enemyId)}
	class:bg-lime-400={enemyId === EnemyEnumSchema.Values.outlawsAlliance}
	class:hover:bg-lime-600={enemyId === EnemyEnumSchema.Values.outlawsAlliance}
	class:text-lime-800={enemyId === EnemyEnumSchema.Values.outlawsAlliance}
	class:border-lime-800={enemyId === EnemyEnumSchema.Values.outlawsAlliance}
	class:bg-lime-600={enemyId === EnemyEnumSchema.Values.outlawsAlliance &&
		$highlightEnemyIds.includes(enemyId)}
	class:bg-indigo-400={enemyId === EnemyEnumSchema.Values.nomadicRiders}
	class:hover:bg-indigo-600={enemyId === EnemyEnumSchema.Values.nomadicRiders}
	class:text-indigo-800={enemyId === EnemyEnumSchema.Values.nomadicRiders}
	class:border-indigo-800={enemyId === EnemyEnumSchema.Values.nomadicRiders}
	class:text-white={$highlightEnemyIds.includes(enemyId)}
	class:border-white={$highlightEnemyIds.includes(enemyId)}
	class:animate-pulse={$pulseEnemyIds.includes(enemyId)}
	on:click={handleClick}
>
	<span class="countdown text-6xl">
		<span style="--value:{$state[enemyId]};" />
	</span>
	<p>{helpers.get.enemyById(enemyId).name}</p>
</button>
