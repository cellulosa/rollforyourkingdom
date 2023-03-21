<script lang="ts">
	import type { ResourceEnumType } from '$lib/zod';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Apple, Coin, Wood } from '@steeze-ui/tabler-icons';

	export let resourceId: ResourceEnumType;
</script>

<Icon
	src={{
		food: Apple,
		wood: Wood,
		gold: Coin
	}[resourceId]}
	theme="default"
/>
