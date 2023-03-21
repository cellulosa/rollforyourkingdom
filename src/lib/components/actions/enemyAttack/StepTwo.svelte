<script lang="ts">
	import {
		highlightCityDistrictSlotIndexes,
		pulseCityDistrictSlotIndex,
		highlightEnemyIds,
		state
	} from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { EnemyType } from '$lib/game/enemies';
	import type { CityDistrictType } from '$lib/game/cityDistricts';
	import { AdvancementEnumSchema, FightEnumSchema, type EnemyEnumType } from '$lib/zod';

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

	// If the condition applies
	if (continueAttack) {
		// If the building is only one, we can pre-select it
		if (slotIndexesWithHighestHpInCityDistrictId.length === 1) {
			$highlightCityDistrictSlotIndexes = [slotIndexesWithHighestHpInCityDistrictId[0]];
		} else {
			// Otherwise we pulsate them and allow the user to choose which building to be attacked
			$pulseCityDistrictSlotIndex = slotIndexesWithHighestHpInCityDistrictId;
		}

		// Highlight the attacking enemyId
		$highlightEnemyIds = [attackingEnemy.id];
	}

	// Handle dispatcher
	export const citySlotClicked = (event: CustomEvent<number>) => {
		// No need to run this unless there is/are building(s) that can be attacked
		if (!continueAttack) return;

		// Only allow to select those buildings we found with the highest HPs
		if (!slotIndexesWithHighestHpInCityDistrictId.includes(event.detail)) return;

		$highlightCityDistrictSlotIndexes = [event.detail];
	};

	// Update the state to move to the next step based on user selection
	const handleClick = () =>
		state.updateState(
			{
				// If there are buildings to attack, let the attack continue
				...(continueAttack
					? {
							[attackingEnemy.id]: helpers.remove.enemy(
								$state[attackingEnemy.id as EnemyEnumType],
								helpers.get.buildingById($state.citySlots[$highlightCityDistrictSlotIndexes[0]])
									.hitPoints +
									// Plus add one if we unlocked MASONRY
									Number(hasMasonry)
							),
							citySlots: helpers.remove.cityDistrictSlot(
								$state.citySlots,
								$highlightCityDistrictSlotIndexes[0]
							),
							// Move to the next fight step
							fight: FightEnumSchema.Values.stepThree
					  }
					: {}),
				// If the attack has finished we can leave the enemyAttack sequence and reset all values - ready for the next fight
				...(!continueAttack
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

{#if continueAttack}
	{#if hasMasonry}
		<Message>
			Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.masonry)
				.name}, all your buildings have an extra HitPoint.
		</Message>
	{/if}

	<Message>
		In {cityDistrictUnderAttack.name}, the {helpers.text.addS(
			slotIndexesWithHighestHpInCityDistrictId.length,
			'building'
		)} with the most HP {#if slotIndexesWithHighestHpInCityDistrictId.length === 1}is{:else}are{/if}
		{helpers.text.commaSeparatedlist(
			slotIndexesWithHighestHpInCityDistrictId.map(
				(citySlot) => `the ${helpers.get.buildingById($state.citySlots[citySlot]).name}`
			)
		)} with {helpers.text.addS(
			helpers.get.buildingById($state.citySlots[slotIndexesWithHighestHpInCityDistrictId[0]])
				.hitPoints + Number(hasMasonry),
			'HitPoint'
		)}.
		{#if slotIndexesWithHighestHpInCityDistrictId.length > 1}
			You can choose which of the two will be attacked.
		{/if}
	</Message>

	{#if $highlightCityDistrictSlotIndexes.length}
		<Message>
			The {attackingEnemy.name} will attack the {helpers.get.buildingById(
				$state.citySlots[$highlightCityDistrictSlotIndexes[0]]
			).name} and will lose {helpers.text.addS(
				helpers.get.buildingById($state.citySlots[$highlightCityDistrictSlotIndexes[0]]).hitPoints +
					Number(hasMasonry),
				'troop'
			)}.
		</Message>
	{/if}
{:else}
	<Message>Since there are no buildings to attack, the attack ends.</Message>
{/if}

<Button
	pulse={(continueAttack && !!$highlightCityDistrictSlotIndexes.length) || !continueAttack}
	{handleClick}>Next</Button
>
