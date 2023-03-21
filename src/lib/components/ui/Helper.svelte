<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { QuestionMarkCircle } from '@steeze-ui/heroicons';
	import { goto } from '$app/navigation';

	export let hash: string;
</script>

<label
	for="my-drawer"
	class="link inline-flex"
	on:click={() => goto(`/#help-${hash}`)}
	on:keydown={() => goto(`/#help-${hash}`)}
>
	<span class="btm-nav-label">
		<slot />
	</span>
	<Icon src={QuestionMarkCircle} theme="outline" class="h-5 w-5" />
</label>
