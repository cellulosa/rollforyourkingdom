<script lang="ts">
	import { state } from '$lib/stores';
	import { defaults } from '$lib/game/defaults';
</script>

<h2 class="text-2xl font-bold">Season</h2>

<div
	class="radial-progress bg-primary text-primary-content border-4 border-primary"
	style="--value:{($state.turn / defaults.maxTurn) * 100};  --size:6rem;"
>
	{$state.turn}
</div>
