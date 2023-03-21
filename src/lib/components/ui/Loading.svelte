<script lang="ts">
	import { loading } from '$lib/stores';
</script>

{#if $loading}
	<div class="fixed top-0 right-5">
		<div class="btn btn-lg btn-square loading bg-base-200 border-none" />
	</div>
{/if}
