<script lang="ts">
	export let pulse: boolean = false;
	export let handleClick: () => void;
	export let disabled: boolean = false;
</script>

<button
	class="btn btn-block mb-2"
	class:animate-pulse={pulse}
	on:click={() => {
		// If the button is not pulsing we should not allow to interact with it
		if (!pulse) return;

		handleClick();
	}}
	disabled={disabled || !pulse}
>
	<slot />
</button>
