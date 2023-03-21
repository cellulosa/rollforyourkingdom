<script lang="ts">
	import Message from '$lib/components/ui/Message.svelte';
	import { state, highlightEnemyIds, highlightCityDistrictIds } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Button from '$lib/components/ui/Button.svelte';
	import { FightEnumSchema } from '$lib/zod';
	import { z } from 'zod';
	import type { EnemyType } from '$lib/game/enemies';
	import type { CityDistrictType } from '$lib/game/cityDistricts';

	export let attackingEnemy: EnemyType;
	export let cityDistrictUnderAttack: CityDistrictType;

	// Initiate the enemyAttack if ...
	const initiateAttack =
		// the relevant enemy has 10 or more troops
		z.number().min(10).safeParse($state[attackingEnemy.id]).success &&
		// we have not initiated a fight already
		$state.fight === FightEnumSchema.Values.stepZero;

	// If we are under attack
	if (initiateAttack) {
		// Highlight the attacking enemyId and the relevant district
		$highlightEnemyIds = [attackingEnemy.id];
		$highlightCityDistrictIds = [cityDistrictUnderAttack.id];
	}

	// Update the state to move to the next step
	const handleClick = () =>
		state.updateState(
			{
				// If we are initiating the attack
				...(initiateAttack
					? {
							// Keep the action and move to the next fight step
							fight: FightEnumSchema.Values.stepOne,
							// Since we are firing the attack, we have have to make sure we start from the outer district
							cityDistrictUnderAttack: false
					  }
					: // If not end this action
					  {
							action: helpers.get.actionById($state.action).next
					  })
			},
			$state
		);
</script>

<Message>
	{#if initiateAttack}
		The {attackingEnemy.name} army has {helpers.text.addS($state[attackingEnemy.id], 'troop')}.
		Ready to fight?!
	{:else}
		Since the {attackingEnemy.name} army has less then 10 troops, nothing happens.
	{/if}
</Message>

<Button pulse={true} {handleClick}>Next</Button>
