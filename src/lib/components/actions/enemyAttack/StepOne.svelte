<script lang="ts">
	import { highlightCityDistrictSlotIndexes, highlightEnemyIds, state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		BuildingEnumSchema,
		FightEnumSchema,
		CityDistrictEnumSchema,
		AdvancementEnumSchema
	} from '$lib/zod';
	import type { EnemyType } from '$lib/game/enemies';
	import type { CityDistrictType } from '$lib/game/cityDistricts';

	export let attackingEnemy: EnemyType;
	export let cityDistrictUnderAttack: CityDistrictType;

	// Highlight the attacking enemyId
	$highlightEnemyIds = [attackingEnemy.id];

	// If the enemy started to invade hightown, override and set that as district under attack
	if ($state.invadingHightown)
		cityDistrictUnderAttack = helpers.get.cityDistrictById(CityDistrictEnumSchema.Values.hightown);

	// Count how many castles we have in the district under attack
	const castlesInCityDistrictUnderAttack = helpers.count.buildingIdInDistrictId(
		$state.citySlots,
		BuildingEnumSchema.Values.castle,
		cityDistrictUnderAttack.id
	);

	// Highlight the casles if we found any
	if (castlesInCityDistrictUnderAttack > 0)
		$highlightCityDistrictSlotIndexes =
			helpers.find.cityDistrictSlotIndexes.withBuildingId.inCityDistrictIds(
				[cityDistrictUnderAttack.id],
				$state.citySlots,
				BuildingEnumSchema.Values.castle
			);

	// Check if we unlocked ARCHERS
	const hasArchers = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.archers);

	// Update the state to move to the next step
	const handleClick = () =>
		state.updateState(
			{
				// If there is a castle in the district the enemy loses 2 troops
				...(castlesInCityDistrictUnderAttack > 0
					? {
							[attackingEnemy.id]: helpers.remove.enemy(
								$state[attackingEnemy.id],
								2 +
									// Plus 3 more if we unlocked ARCHERS
									(hasArchers ? 3 : 0)
							)
					  }
					: {}),
				// Move to the next fight step
				fight: FightEnumSchema.Values.stepTwo
			},
			$state
		);
</script>

<Message>
	You have {helpers.text.addS(castlesInCityDistrictUnderAttack, BuildingEnumSchema.Values.castle)} in
	{cityDistrictUnderAttack.name}, so the enemy will
	{#if castlesInCityDistrictUnderAttack > 0}
		loses 2 units.
		{#if hasArchers}Plus 3 units more, since you unlocked {helpers.get.advancementById(
				AdvancementEnumSchema.Values.archers
			).name}.{/if}
	{:else}
		not lose any unit as they invade it.
	{/if}
</Message>

<Button pulse={true} {handleClick}>Next</Button>
