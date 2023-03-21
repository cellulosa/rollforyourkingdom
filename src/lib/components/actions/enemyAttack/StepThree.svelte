<script lang="ts">
	import { state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { EnemyType } from '$lib/game/enemies';
	import type { CityDistrictType } from '$lib/game/cityDistricts';
	import { FightEnumSchema, CityDistrictEnumSchema } from '$lib/zod';
	import { z } from 'zod';

	export let attackingEnemy: EnemyType;
	export let cityDistrictUnderAttack: CityDistrictType;
	export let hasMasonry: boolean;

	// Find the buildings with the highest HitPoints
	const slotIndexesWithHighestHpInCityDistrictId =
		helpers.find.cityDistrictSlotIndexes.highestHPInCityDistrictId(
			$state.citySlots,
			cityDistrictUnderAttack.id,
			hasMasonry
		);

	// Check if we did find some buildings and if these have more HPs than the enemy has troops (the enemy only attacks if they have as many troops as the HP of the building with the most HPs)
	const continueAttack =
		!!slotIndexesWithHighestHpInCityDistrictId.length &&
		helpers.get.buildingById($state.citySlots[slotIndexesWithHighestHpInCityDistrictId[0]])
			.hitPoints +
			// Also add 1 if we unlocked MASONRY
			Number(hasMasonry) <=
			$state[attackingEnemy.id];

	// If the enemy still have troops but there are no more buildings to attack in the outer districts, they invade Hightown
	const invadeHightown =
		cityDistrictUnderAttack.id !== CityDistrictEnumSchema.Values.hightown &&
		!slotIndexesWithHighestHpInCityDistrictId.length;

	// Update the state to move to the next step
	const handleClick = () =>
		state.updateState(
			{
				// If the enemy has more troops than the next building with the highest HP, the attack continues
				...(continueAttack
					? // Return to a step back
					  { fight: FightEnumSchema.Values.stepTwo }
					: {}),
				// If the enemy invades hightown
				...(invadeHightown
					? {
							invadingHightown: true,
							fight: FightEnumSchema.Values.stepOne
					  }
					: {}),
				// Finally, if the enemy does not have more troops than the next building with the higest HP, or simply is left with zero troops, the attack sequence ends
				...(!continueAttack || z.number().nonpositive().safeParse($state[attackingEnemy.id]).success
					? {
							fight: FightEnumSchema.Values.stepZero,
							action: helpers.get.actionById($state.action).next,
							invadingHightown: false
					  }
					: {})
			},
			$state
		);
</script>

<Message>
	{#if z.number().nonpositive().safeParse($state[attackingEnemy.id]).success}
		Since the {attackingEnemy.name} have no more troops, the attack ends.
	{:else if invadeHightown}
		Since there are no more buildings to attack on the {cityDistrictUnderAttack.name}, but the {attackingEnemy.name}
		still have troops, they will now invade {helpers.get.cityDistrictById(
			CityDistrictEnumSchema.Values.hightown
		).name}.
	{:else if continueAttack}
		Since the {attackingEnemy.name} do not have less troops than the next building left with the most
		HP (the
		{helpers.get.buildingById($state.citySlots[slotIndexesWithHighestHpInCityDistrictId[0]]).name}),
		the attack continues.
	{:else}
		Since the {attackingEnemy.name} have less troops then the number of HP of the next building left
		with more HP, the attack ends.
	{/if}
</Message>

<Button pulse={true} {handleClick}>Next</Button>
