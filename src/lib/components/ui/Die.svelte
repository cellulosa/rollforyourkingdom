<script lang="ts">
	import type { DieEnumType } from '$lib/zod';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from '@steeze-ui/tabler-icons';

	export let die: DieEnumType;
</script>

<Icon
	src={{
		one: Dice1,
		two: Dice2,
		three: Dice3,
		four: Dice4,
		five: Dice5,
		six: Dice6
	}[die]}
	theme="filled"
/>
