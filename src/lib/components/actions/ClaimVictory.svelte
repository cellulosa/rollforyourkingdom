<script lang="ts">
	import { state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Helper from '$lib/components/ui/Helper.svelte';
	import { newGame } from '$lib/game/newGame';
	import { BuildingEnumSchema, ResourceEnumSchema } from '$lib/zod';
	import party from 'party-js';
	import { afterUpdate } from 'svelte';

	// Chech if we won
	const isCulturalSupremacy = helpers.game.isCulturalSupremacy($state);
	const isMilitarySupremacy = helpers.game.isMilitarySupremacy($state);
	const isEconomicSupremacy = helpers.game.isEconomicSupremacy($state);
	const youWon = isCulturalSupremacy || isMilitarySupremacy || isEconomicSupremacy;

	// The node where we will emit out confetti, in the case we won the game
	let node: HTMLElement;

	// If we won, we get some confetti!
	afterUpdate(() => {
		if (youWon)
			party.confetti(node, {
				count: 140
			});
	});

	// Count the castles, taverns, markets, abbeys
	const countCastlesInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.castle
	);
	const countTavernsInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.tavern
	);
	const countMarketsInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.market
	);

	// build an array with the name of those enemies which have more than 12 troops
	const enemiesWithMoreThanTwelveTroops = helpers.find.enemyIds
		.withMoreThanXTroops($state, 12)
		.map((enemyId) => helpers.get.enemyById(enemyId).name);

	// Move to the next turn
	const handleClick = () =>
		state.updateState(
			{
				...newGame,
				citySlots: $state.citySlots,
				unlockedAdvancements: $state.unlockedAdvancements,
				startTime: $state.startTime,
				turn: $state.turn + 1,
				wood: $state.wood,
				food: $state.food,
				gold: $state.gold,
				outlawsAlliance: $state.outlawsAlliance,
				blackrockClan: $state.blackrockClan,
				nomadicRiders: $state.nomadicRiders
			},
			$state
		);

	// Start a new game
	const startNewGame = () => state.updateState(newGame, $state);
</script>

<div class="w-full" bind:this={node} />

<Message>
	Time to check if you have achieved one of the <Helper hash="victoryConditions"
		>Victory Conditions</Helper
	>.
</Message>

<Message colour={isCulturalSupremacy ? 'success' : null}>
	Since you have {helpers.text.addS($state.unlockedAdvancements.length, 'advancement scroll')}, you
	{#if isCulturalSupremacy}
		have achieved cultural supremacy! Congratulations!
	{:else}
		have not achieved cultural supremacy.
	{/if}
</Message>

<Message colour={isMilitarySupremacy ? 'success' : null}>
	Since you have {helpers.text.addS(countCastlesInCitySlots, BuildingEnumSchema.Values.castle)}, {helpers.text.addS(
		countTavernsInCitySlots,
		BuildingEnumSchema.Values.tavern
	)} and {enemiesWithMoreThanTwelveTroops.length > 0
		? helpers.text.commaSeparatedlist(enemiesWithMoreThanTwelveTroops)
		: 'no enemies'} with more than 12 troops, you
	{#if isMilitarySupremacy}
		have achieved military supremacy! Congratulations!
	{:else}
		have not achieved mlitary supremacy.
	{/if}
</Message>

<Message colour={isEconomicSupremacy ? 'success' : null}>
	Since you have
	{helpers.text.addS(countMarketsInCitySlots, BuildingEnumSchema.Values.market)} and {helpers.text.addS(
		$state.gold,
		ResourceEnumSchema.Values.gold
	)}, you
	{#if isEconomicSupremacy}
		have achieved economic supremacy! Congratulations!
	{:else}
		have not achieved economic supremacy.
	{/if}
</Message>

{#if youWon}
	<Message>You can start a new game now.</Message>

	<Button pulse={true} handleClick={startNewGame}>Start a new game!</Button>
{/if}

{#if !youWon}
	<Message>The game is still on! Move to the next round.</Message>

	<Message>
		Keep in mind the <Helper hash="losingConditions">Losing Conditions</Helper>.
	</Message>

	<Button pulse={!youWon} {handleClick}>Next turn</Button>
{/if}
