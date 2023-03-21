<script lang="ts">
	import { state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import { newGame } from '$lib/game/newGame';
	import Helper from '$lib/components/ui/Helper.svelte';

	const startNewGame = () => state.updateState(newGame, $state);
</script>

<div class="modal modal-bottom sm:modal-middle" class:modal-open={helpers.game.youLose($state)}>
	<div class="modal-box">
		<p class="py-4">
			You lost! Keep in mind the <Helper hash="losingConditions">Losing Conditions</Helper>
		</p>
		<p>Try again.</p>
		<div class="modal-action">
			<label
				for="modal-trade"
				class="btn btn-success"
				on:click={startNewGame}
				on:keydown={startNewGame}>Start a new game!</label
			>
		</div>
	</div>
</div>
