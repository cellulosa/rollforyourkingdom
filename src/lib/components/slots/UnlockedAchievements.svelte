<script lang="ts">
	import { state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Helper from '$lib/components/ui/Helper.svelte';
</script>

{#if $state.unlockedAdvancements.length > 0}
	<div>
		<h2 class="text-2xl font-bold">Advancements unlocked</h2>
		<ul>
			{#each $state.unlockedAdvancements as advancementId}
				<li>
					<Helper hash={advancementId}>{helpers.get.advancementById(advancementId).name}</Helper>
				</li>
			{/each}
		</ul>
	</div>
{/if}
