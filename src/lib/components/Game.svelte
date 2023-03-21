<script lang="ts">
	import { state } from '$lib/stores';
	import RollTheDice from '$lib/components/actions/RollTheDice.svelte';
	import ReRollOrChange from '$lib/components/actions/ReRollOrChange.svelte';
	import ReRollOrChangeForAstronomy from '$lib/components/actions/ReRollOrChangeForAstronomy.svelte';
	import PlayDie from '$lib/components/actions/PlayDie.svelte';
	import Harvest from '$lib/components/actions/Harvest.svelte';
	import EnemyAttack from '$lib/components/actions/EnemyAttack.svelte';
	import Collect from '$lib/components/actions/Collect.svelte';
	import MineGold from '$lib/components/actions/MineGold.svelte';
	import Trade from '$lib/components/actions/Trade.svelte';
	import MercenaryTroop from '$lib/components/actions/MercenaryTroop.svelte';
	import Plague from '$lib/components/actions/Plague.svelte';
	import Build from '$lib/components/actions/Build.svelte';
	import Attack from '$lib/components/actions/Attack.svelte';
	import Thieves from '$lib/components/actions/Thieves.svelte';
	import Worship from '$lib/components/actions/Worship.svelte';
	import Research from '$lib/components/actions/Research.svelte';
	import Riot from '$lib/components/actions/Riot.svelte';
	import FeedTheHungry from '$lib/components/actions/FeedTheHungry.svelte';
	import BarbariansAtGate from '$lib/components/actions/BarbariansAtGate.svelte';
	import ClaimVictory from '$lib/components/actions/ClaimVictory.svelte';
	import Loading from '$lib/components/ui/Loading.svelte';
	import Helper from '$lib/components/ui/Helper.svelte';
	import Map from '$lib/components/Map.svelte';
	import YouLoseModal from '$lib/components/modals/YouLoseModal.svelte';
	import {
		EnemyEnumSchema,
		ResourceEnumSchema,
		type ActionEnumType,
		type EnemyEnumType,
		type ResourceEnumType
	} from '$lib/zod';
	import ResourceSlot from '$lib/components/slots/ResourceSlot.svelte';
	import EnemySlot from '$lib/components/slots/EnemySlot.svelte';
	import SeasonMark from '$lib/components/slots/SeasonMark.svelte';
	import UnlockedAchievements from '$lib/components/slots/UnlockedAchievements.svelte';
	import DiceReserve from '$lib/components/slots/DiceReserve.svelte';
	import Message from '$lib/components/ui/Message.svelte';
	import { z } from 'zod';
	import ActionsForSelectedDie from '$lib/components/cards/ActionsForSelectedDie.svelte';
	import DoneWithDie from '$lib/components/actions/DoneWithDie.svelte';
	import type { ComponentType } from 'svelte';

	// This is the parent for the dispatchers that we will override
	let enemySlotClicked: (event: CustomEvent<EnemyEnumType>) => void;
	let resourceSlotClicked: (event: CustomEvent<ResourceEnumType>) => void;
	let citySlotClicked: (event: CustomEvent<number>) => void;

	// And the parent for the selected die, which is passed across various children components
	let selectedDie: number | undefined = undefined;

	const components: {
		[key in ActionEnumType]: ComponentType;
	} = {
		rollTheDice: RollTheDice,
		reRollOrChange: ReRollOrChange,
		reRollOrChangeForAstronomy: ReRollOrChangeForAstronomy,
		playDie: PlayDie,
		harvest: Harvest,
		nomadsAttack: EnemyAttack,
		collect: Collect,
		outlawsAttack: EnemyAttack,
		mineGold: MineGold,
		blackrockClanAttacks: EnemyAttack,
		trade: Trade,
		mercenaryTroop: MercenaryTroop,
		plague: Plague,
		build: Build,
		attack: Attack,
		thieves: Thieves,
		worship: Worship,
		research: Research,
		riot: Riot,
		doneWithDie: DoneWithDie,
		feedTheHungry: FeedTheHungry,
		barbariansAtGate: BarbariansAtGate,
		claimVictory: ClaimVictory
	};
</script>

<div class="flex">
	<div class="w-5/12 mr-3">
		{#if selectedDie !== undefined && z.number().nonnegative().safeParse(selectedDie).success}
			<Message>
				{#key selectedDie}
					<ActionsForSelectedDie {selectedDie} />
				{/key}
			</Message>
		{/if}

		<svelte:component
			this={components[$state.action]}
			{selectedDie}
			bind:enemySlotClicked
			bind:resourceSlotClicked
			bind:citySlotClicked
		/>
	</div>

	<div class="w-4/12 mr-3">
		<Map {citySlotClicked} />
	</div>

	<div class="w-3/12">
		{#key $state.dice}
			<DiceReserve bind:selectedDie />
		{/key}

		<SeasonMark />

		<UnlockedAchievements />

		<h2 class="text-2xl font-bold">Enemies</h2>

		<EnemySlot
			enemyId={EnemyEnumSchema.Values.outlawsAlliance}
			on:enemySlotClicked={enemySlotClicked}
		/>
		<EnemySlot
			enemyId={EnemyEnumSchema.Values.blackrockClan}
			on:enemySlotClicked={enemySlotClicked}
		/>
		<EnemySlot
			enemyId={EnemyEnumSchema.Values.nomadicRiders}
			on:enemySlotClicked={enemySlotClicked}
		/>

		<h2 class="text-2xl font-bold">Resources</h2>

		<ResourceSlot
			resourceId={ResourceEnumSchema.Values.food}
			on:resourceSlotClicked={resourceSlotClicked}
		/>
		<ResourceSlot
			resourceId={ResourceEnumSchema.Values.wood}
			on:resourceSlotClicked={resourceSlotClicked}
		/>
		<ResourceSlot
			resourceId={ResourceEnumSchema.Values.gold}
			on:resourceSlotClicked={resourceSlotClicked}
		/>

		<ul class="my-3">
			<li><Helper hash="victoryConditions">Victory Conditions</Helper></li>
			<li><Helper hash="losingConditions">Losing Conditions</Helper></li>
		</ul>
	</div>
</div>

<Loading />

<YouLoseModal />
