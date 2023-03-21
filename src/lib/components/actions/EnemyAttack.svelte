<script lang="ts">
	import { state } from '$lib/stores';
	import StepZero from '$lib/components/actions/enemyAttack/StepZero.svelte';
	import StepOne from '$lib/components/actions/enemyAttack/StepOne.svelte';
	import StepTwo from '$lib/components/actions/enemyAttack/StepTwo.svelte';
	import StepThree from '$lib/components/actions/enemyAttack/StepThree.svelte';
	import {
		ActionEnumSchema,
		AdvancementEnumSchema,
		CityDistrictEnumSchema,
		EnemyEnumSchema,
		type FightEnumType
	} from '$lib/zod';
	import type { ComponentType } from 'svelte';
	import type { EnemyType } from '$lib/game/enemies';
	import type { CityDistrictType } from '$lib/game/cityDistricts';
	import { helpers } from '$lib/game/helpers';

	// Pass our dispatcher
	export let citySlotClicked: (event: CustomEvent<number>) => void;

	// Set the attacking enemy and the relevant district values
	let attackingEnemy: EnemyType;
	let cityDistrictUnderAttack: CityDistrictType;

	// Check if we unlocked MASONRY
	let hasMasonry = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.masonry);

	if ($state.action === ActionEnumSchema.Values.nomadsAttack) {
		attackingEnemy = helpers.get.enemyById(EnemyEnumSchema.Values.nomadicRiders);
		cityDistrictUnderAttack = helpers.get.cityDistrictById(
			CityDistrictEnumSchema.Values.countryDistrict
		);
	}
	if ($state.action === ActionEnumSchema.Values.outlawsAttack) {
		attackingEnemy = helpers.get.enemyById(EnemyEnumSchema.Values.outlawsAlliance);
		cityDistrictUnderAttack = helpers.get.cityDistrictById(CityDistrictEnumSchema.Values.theGrove);
	}
	if ($state.action === ActionEnumSchema.Values.blackrockClanAttacks) {
		attackingEnemy = helpers.get.enemyById(EnemyEnumSchema.Values.blackrockClan);
		cityDistrictUnderAttack = helpers.get.cityDistrictById(
			CityDistrictEnumSchema.Values.mountainside
		);
	}

	// Build an object to load the relevant Svelte component
	const components: {
		[key in FightEnumType]: ComponentType;
	} = {
		stepZero: StepZero,
		stepOne: StepOne,
		stepTwo: StepTwo,
		stepThree: StepThree
	};
</script>

<svelte:component
	this={components[$state.fight]}
	{attackingEnemy}
	{hasMasonry}
	bind:cityDistrictUnderAttack
	bind:citySlotClicked
/>
