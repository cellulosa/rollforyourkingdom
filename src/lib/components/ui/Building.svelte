<script lang="ts">
	import type { BuildingEnumType } from '$lib/zod';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		ChristmasTree,
		BuildingCottage,
		Axe,
		Hammer,
		BuildingCastle,
		BuildingStore,
		BuildingChurch,
		Beer,
		Seeding
	} from '@steeze-ui/tabler-icons';

	export let buildingId: BuildingEnumType;
</script>

<Icon
	src={{
		none: Seeding,
		tree: ChristmasTree,
		farm: BuildingCottage,
		lumberjack: Axe,
		quarry: Hammer,
		castle: BuildingCastle,
		market: BuildingStore,
		abbey: BuildingChurch,
		tavern: Beer
	}[buildingId]}
	theme="filled"
/>
