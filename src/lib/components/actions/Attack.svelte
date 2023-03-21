<script lang="ts">
	import {
		state,
		highlightEnemyIds,
		pulseEnemyIds,
		highlightBuildingIds,
		highlightResourceIds
	} from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		AdvancementEnumSchema,
		BuildingEnumSchema,
		ResourceEnumSchema,
		type EnemyEnumType,
		type ResourceEnumType
	} from '$lib/zod';
	import { z } from 'zod';

	// Count how many enemies have 5 or more troops
	const enemiesWith5OrMore = helpers.find.enemyIds.withMoreThanXTroops($state, 5);

	// Let's count how many castles we have
	const castlesInCity = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.castle
	);

	let amountToRemove = 0;

	// If we have applicable enemies and at least one castle, we can highlight them
	const isAttack = enemiesWith5OrMore.length > 0 && castlesInCity > 0;
	if (isAttack) {
		$pulseEnemyIds = enemiesWith5OrMore;
		$highlightBuildingIds = [BuildingEnumSchema.Values.castle];
		amountToRemove = castlesInCity * 3;
	}

	// Check if we unlocked CAVALRY
	const hasCavalry = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.cavalry);

	// Check if we have STEEL WEAPONRY
	const hasSteelWeaponry = $state.unlockedAdvancements.includes(
		AdvancementEnumSchema.Values.steelWeaponry
	);

	// Handle dispatcher for the enemy slot click
	export const enemySlotClicked = (event: CustomEvent<EnemyEnumType>) => {
		// Proceed only if the attack condition applies
		if (!isAttack) return;

		// Allow to select only one of the eligible enemies
		if (!$pulseEnemyIds.includes(event.detail)) return;

		// If we unlocked CAVALRY, we allow enemy multi-selection (up to the number of available castles)
		if (hasCavalry && $highlightEnemyIds.length < castlesInCity) {
			$highlightEnemyIds = [...new Set([...$highlightEnemyIds, event.detail])];
		} else {
			// Otherwise simply Set the clicked enemyId
			$highlightEnemyIds = [event.detail];
		}
	};

	// Check if we can pay 1 extra Gold to eliminate 1 extra Enemy
	let canKillExtraEnemy: boolean = false;
	$: canKillExtraEnemy = hasSteelWeaponry && $state.gold >= $highlightEnemyIds.length;

	// Handle dispatcher for the resource slot click, that allows to kill an extra enemy
	export const resourceSlotClicked = (event: CustomEvent<ResourceEnumType>) => {
		// Proceed only if the we have STEEL WEAPONRY and have enough gold
		if (!canKillExtraEnemy) return;

		// Proceed only if we selected the gold
		if (event.detail !== ResourceEnumSchema.Values.gold) return;

		// Hilight resource slot
		$highlightResourceIds = [event.detail];
	};

	// Move to the next action without doing anything
	const handleClick = () =>
		state.updateState(
			{
				// If the condition applies and have selected an enemy
				// Handle this differently if we selected more than one enemy (with CAVALRY)
				...(isAttack && $highlightEnemyIds.length > 1 && hasCavalry
					? {
							...$highlightEnemyIds.reduce(
								(result, enemyId) => ({
									...result,
									[enemyId]: helpers.remove.enemy(
										$state[enemyId as EnemyEnumType],
										// If we selected more than one enemy, split the damage across these
										amountToRemove / $highlightEnemyIds.length +
											// Plus add 1 if we selected to pay extra gold to kill extra troops
											(canKillExtraEnemy ? 1 : 0)
									)
								}),
								{}
							),
							// We also get a gold for any any enemy we loot (meaning, that goes to zero)
							gold: helpers.add.resource(
								$state.gold,
								$highlightEnemyIds.reduce(
									(result, enemyId) => {
										if (
											z
												.number()
												.nonpositive()
												.safeParse(
													helpers.remove.enemy(
														$state[enemyId as EnemyEnumType],
														amountToRemove / $highlightEnemyIds.length +
															// Plus add 1 if we selected to pay extra gold to kill extra troops
															(canKillExtraEnemy ? 1 : 0)
													)
												).success
										)
											result += 1;

										return result;
									},
									0 -
										// Remove the number of enemy slots selected if we selected to pay extra gold to kill extra troops
										(canKillExtraEnemy ? $highlightEnemyIds.length : 0)
								)
							)
					  }
					: {}),
				// If we selected a single enemy
				...(isAttack && $highlightEnemyIds.length === 1
					? {
							// The new enemy troop value
							[$highlightEnemyIds[0] as EnemyEnumType]: helpers.remove.enemy(
								$state[$highlightEnemyIds[0] as EnemyEnumType],
								amountToRemove +
									// Plus add 3 if we have CAVALRY (when we selected a single enemy)
									(hasCavalry ? 3 : 0) +
									// Plus add 1 if we selected to pay extra gold to kill an extra troops
									(canKillExtraEnemy ? 1 : 0)
							),
							// We also get a gold if we loot the enemy (if the enemy goes to zero)
							...(z
								.number()
								.nonpositive()
								.safeParse(
									helpers.remove.enemy(
										$state[$highlightEnemyIds[0] as EnemyEnumType],
										amountToRemove +
											// Plus add 1 if we selected to pay extra gold to kill an extra troops
											(canKillExtraEnemy ? 1 : 0)
									)
								).success
								? {
										gold: helpers.add.resource(
											$state.gold,
											1 -
												// Remove 1 if we selected to pay extra gold to kill an extra troops
												(canKillExtraEnemy ? 1 : 0)
										)
								  }
								: {})
					  }
					: {}),
				action: helpers.get.actionById($state.action).next
			},
			$state
		);
</script>

{#if isAttack}
	<Message>
		You have {helpers.text.addS(castlesInCity, BuildingEnumSchema.Values.castle)}; therefore, you
		can remove {amountToRemove} enemy troops from
		{helpers.text.commaSeparatedlist(
			$pulseEnemyIds.map((enemyId) => helpers.get.enemyById(enemyId).name),
			true
		)}. Select the relevant enemy slot to proceed.
	</Message>

	{#if hasCavalry}
		<Message
			>Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.cavalry)
				.name}{#if enemiesWith5OrMore.length > 1 && castlesInCity > 1}, you can split the damage
				between different Enemy Armies, or{/if}
			you can deal 3 extra damage.</Message
		>
	{/if}

	{#if $highlightEnemyIds.length === 1}
		<Message>
			You are going to remove {helpers.text.addS(amountToRemove, 'enemy troop')} from {helpers.get.enemyById(
				$highlightEnemyIds[0]
			).name}{#if hasCavalry}, plus 3 since you selected a single enemy{/if}.
		</Message>
	{:else if $highlightEnemyIds.length > 1}
		<Message>
			You are going to remove {helpers.text.addS(
				amountToRemove / $highlightEnemyIds.length,
				'enemy troop'
			)} enemy troops from {helpers.text.commaSeparatedlist(
				$highlightEnemyIds.map((enemyId) => helpers.get.enemyById(enemyId).name)
			)}.
		</Message>
	{/if}

	{#if hasSteelWeaponry}
		<Message>
			Since you unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.steelWeaponry)
				.name}, you can pay 1 extra Gold to eliminate 1 extra Enemy. If you wish to do so, please
			select the Gold slot.
		</Message>

		{#if canKillExtraEnemy && $highlightResourceIds.length}
			<Message>
				You are going to pay {helpers.text.addS(
					$highlightEnemyIds.length,
					ResourceEnumSchema.Values.gold
				)} to eliminate an extra enemy troop {#if $highlightEnemyIds.length > 1}
					from each selected enemy{/if}.
			</Message>
		{/if}
	{/if}
{:else}
	<Message
		>There are no enemies with 5 or more troops, or you do not have any castle. Therefore, nothing
		happens.</Message
	>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
