<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { defaults } from '$lib/game/defaults';

	// Show overlay on page load if relevant
	let isDrawerOpen = false;

	const toggle = () => {
		// Toggle isDrawerOpen on overlay change
		isDrawerOpen = !isDrawerOpen;

		// If we are closing the overlay, clear the url
		if (!isDrawerOpen) goto('/');
	};
</script>

<div class="drawer">
	<input
		id="my-drawer"
		type="checkbox"
		class="drawer-toggle"
		checked={isDrawerOpen}
		on:change={toggle}
	/>
	<div class="drawer-content">
		<slot />
	</div>
	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay" />
		<div class="menu p-4 w-80 bg-base-100 text-base-content">
			<article class="prose">
				<!-- Game -->

				{#if $page.url.hash.match(/#help-dice-reserve/)}
					<h2 class="mt-8">Dice reserve</h2>
					<p>Your dice reserve is formed of your rolled minus duplicate dice.</p>
					<p>You can decide in which order to play the dice in your reserve.</p>
					<p>
						When you play a die you will resolve all the actions one at the time. Some of them may
						be positive and some negative but you have to resolve them all.
					</p>
					<p>You can play each action only once.</p>
				{/if}

				{#if $page.url.hash.match(/#help-feedTheHungry/)}
					<h2 class="mt-8">Feed the hungry</h2>
					<p>
						In this action, you must pay 1 Food for each Castle, Tavern, Market and Abbey you have
						in your city.
					</p>
					<p>Note that if any of your resources drop to 0 you immediately LOSE the game.</p>
				{/if}

				{#if $page.url.hash.match(/#help-barbariansAtGate/)}
					<h2 class="mt-8">Barbarians at the gate</h2>
					<p>
						For each building in your city add one troop to one of the Enemy Army boxes (Outlaws
						Alliance, Blackrock Clan and Nomadic Riders), you choose how to split these troops
						between the three enemies. You cannot assign more than 18 units to each army.
					</p>
					<p>If all 3 armies are maxed out, you LOSE.</p>
				{/if}

				{#if $page.url.hash.match(/#help-victoryConditions/)}
					<h2 class="mt-8">Victory conditions</h2>
					<p>You win the game achieving one of the following three conditions.</p>
					<h3>Cultural supremacy</h3>
					<p>Unlock 9 Advancement Scrolls.</p>
					<h3>Military supremacy</h3>
					<p>
						Have all the 4 Castles and 2 Taverns, and all the enemies with no more then 12 troops
						each.
					</p>
					<h3>Economic supremacy</h3>
					<p>Have 3 Markets in your city and at least 12 Gold.</p>
				{/if}

				{#if $page.url.hash.match(/#help-losingConditions/)}
					<h2 class="mt-8">Losing conditions</h2>
					<p>You lose the game if:</p>
					<ul>
						<li>Any of your resources drops to 0</li>
						<li>You lose all the buildings in the Hightown district</li>
						<li>All 3 enemy armies reach the maximum number of 18 units</li>
						<li>You reach the end of the twelfth turn without winning first</li>
					</ul>
				{/if}

				<!-- Dice actions -->

				{#if $page.url.hash.match(/#help-harvest/)}
					<h2 class="mt-8">Harvest</h2>
					<p>
						In the Harvest action, for each Farm you own you receive as much Wood as the current
						Season multiplier.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-nomadsAttack/)}
					<h2 class="mt-8">Nomads Attack</h2>
					<p>
						In the Nomads Attack action, if the Nomadic Riders have 10 or more troops, they invade
						the Country District first, then if there are no more buildings also Hightown.
					</p>
					<p>The attack happens in three phases:</p>
					<ul>
						<li>
							When the enemy invades a district, they immediately lose 2 units if there's a Castle
							in that district.
						</li>
						<li>
							Surviving enemy troops attack the building with more HP in the district (if there are
							more with the same amount, you choose which one). If they have enough troops they lose
							as many troops as the HP of the attacked building and erase it, then attack the next
							Building left with more HP, or invade the inner district if the outer one is left
							without any building.
						</li>
						<li>
							When the enemies have less troops then the number of HP of the next building left with
							more HP, the attack ends. The surviving enemies remain in the Enemy Army box.
						</li>
					</ul>
				{/if}

				{#if $page.url.hash.match(/#help-collect/)}
					<h2 class="mt-8">Collect</h2>
					<p>
						In the Collection action, for each Lumberjack you own you receive as much Wood as many
						Trees there are within the same district.
					</p>
					<p>You may also select 1 Tree to erase it and get +5 more Wood.</p>
				{/if}

				{#if $page.url.hash.match(/#help-outlawsAttack/)}
					<h2 class="mt-8">Outlaws Attack</h2>
					<p>
						If the Outlaws Alliance army has 10 or more troops, it invades The Grove district first,
						then if there are no more buildings also Hightown.
					</p>
					<p>The attack happens in three phases:</p>
					<ul>
						<li>
							When the enemy invades a district, they immediately lose 2 units if there's a Castle
							in that district.
						</li>
						<li>
							Surviving enemy troops attack the building with more HP in the district (if there are
							more with the same amount, you choose which one). If they have enough troops they lose
							as many troops as the HP of the attacked building and erase it, then attack the next
							Building left with more HP, or invade the inner district if the outer one is left
							without any building.
						</li>
						<li>
							When the enemies have less troops then the number of HP of the next building left with
							more HP, the attack ends. The surviving enemies remain in the Enemy Army box.
						</li>
					</ul>
				{/if}

				{#if $page.url.hash.match(/#help-mineGold/)}
					<h2 class="mt-8">Mine Gold</h2>
					<p>In the Mine Gold action, for each Quarry you own you receive 1 Gold.</p>
				{/if}

				{#if $page.url.hash.match(/#help-blackrockClanAttacks/)}
					<h2 class="mt-8">BlackrockClan Attacks</h2>
					<p>
						In the Blackrock Clan attack action, if the Blackrock Clan army has 10 or more troops,
						it invades Mountainside first, then if there are no more buildings also Hightown.
					</p>
					<p>The attack happens in three phases:</p>
					<ul>
						<li>
							When the enemy invades a district, they immediately lose 2 units if there's a Castle
							in that district.
						</li>
						<li>
							Surviving enemy troops attack the building with more HP in the district (if there are
							more with the same amount, you choose which one). If they have enough troops they lose
							as many troops as the HP of the attacked building and erase it, then attack the next
							Building left with more HP, or invade the inner district if the outer one is left
							without any building.
						</li>
						<li>
							When the enemies have less troops then the number of HP of the next building left with
							more HP, the attack ends. The surviving enemies remain in the Enemy Army box.
						</li>
					</ul>
				{/if}

				{#if $page.url.hash.match(/#help-trade/)}
					<h2 class="mt-8">Trade</h2>
					<p>
						In the Trade action, for each Market you own you can perform one TRADING GOODS action if
						you have the required resources.
					</p>
					<p>You cannot have more than 18 of each resource.</p>
				{/if}

				{#if $page.url.hash.match(/#help-mercenaryTroop/)}
					<h2 class="mt-8">Mercenary Troop</h2>
					<p>
						In the Mercenary Troop action, for each Tavern you have you can pay 1 Gold to remove 3
						Enemies from one Enemy Army of your choice.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-plague/)}
					<h2 class="mt-8">Plague</h2>
					<p>
						In the Plague action, in each district with 4 or more buildings but no Abbey you must
						erase 1 building.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-build/)}
					<h2 class="mt-8">Build</h2>
					<p>
						During the Build action, you can build up to {defaults.buildUpTo} new buildings in your town.
					</p>
					<p>Check Buildings Chart to know costs and rules of placement.</p>
					<p>Beware, if you want to build over an occupied slot, pay 2 Food more.</p>
				{/if}

				{#if $page.url.hash.match(/#help-attack/)}
					<h2 class="mt-8">Attack</h2>
					<p>
						In the Attack action you can choose one enemy with 5 or more units and remove 3 units
						for each Castle that you own.
					</p>
					<p>Loot: if you erase the last enemy unit of one Army, you get 1 Gold.</p>
				{/if}

				{#if $page.url.hash.match(/#help-thieves/)}
					<h2 class="mt-8">Thieves</h2>
					<p>
						In the Thieves action, in each district with at least 4 buildings but no Market, you
						must pay either 1 Gold, or 2 Woods or 3 Woods.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-worship/)}
					<h2 class="mt-8">Worship</h2>
					<p>
						In the Workship action, for each Abbey in a district with at least a Castle, a Market or
						a Tavern you receive 1 Gold.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-research/)}
					<h2 class="mt-8">Research</h2>
					<p>
						In the Research action, if you have at least one Abbey you can unlock a new Advancement
						paying its cost.
					</p>
					<p>The Advancements have prerequisites to be met at the moment of this action.</p>
				{/if}

				{#if $page.url.hash.match(/#help-riot/)}
					<h2 class="mt-8">Riot</h2>
					<p>
						In the Riot action, in each district with 4 or more buildings but no Tavern you must pay
						1 Gold or erase 1 building.
					</p>
					<p>You will resolve this one district at the time.</p>
				{/if}

				<!-- Advancements -->

				{#if $page.url.hash.match(/#help-cropRotation/)}
					<h2 class="mt-8">Crop rotation</h2>
					<p>When you resolve a Harvest event, each Farm produces 1 Food more.</p>
				{/if}

				{#if $page.url.hash.match(/#help-improvedWoodaxe/)}
					<h2 class="mt-8">Improved Woodaxe</h2>
					<p>When you resolve a COLLECT event, each LUMBERJACK produces 1 WOOD more.</p>
				{/if}

				{#if $page.url.hash.match(/#help-smelting/)}
					<h2 class="mt-8">Smelting</h2>
					<p>When you resolve a MINE GOLD event, each QUARRY produces 1 GOLD more.</p>
				{/if}

				{#if $page.url.hash.match(/#help-cavalry/)}
					<h2 class="mt-8">Cavalry</h2>
					<p>
						When you ATTACK you can split the damage from your CASTLES between different ENEMY
						ARMIES; if you don't split the damage, you deal 3 extra damage.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-archers/)}
					<h2 class="mt-8">Archers</h2>
					<p>
						When the ENEMIES invade a DISTRICT with a CASTLE, in Phase 1 they lose 3 units more.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-steelWeaponry/)}
					<h2 class="mt-8">Steel Weaponry</h2>
					<p>
						When you resolve MERCENARY TROOPS or ATTACK actions, you can pay 1 extra Gold to
						eliminate 1 extra Enemy from all the Armies who suffered at least one loss during the
						action.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-medicine/)}
					<h2 class="mt-8">Medicine</h2>
					<p>
						Ignore the Plague event in all districts until you have at least 1 Abbey in your city
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-fyrdMilitia/)}
					<h2 class="mt-8">Fyrd Militia</h2>
					<p>
						Ignore the Riot event in all districts until you have at least 1 Tavern in your city.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-guildOfThieves/)}
					<h2 class="mt-8">Guild Of Thieves</h2>
					<p>
						Ignore the Thieves event in all districts until you have at least 1 Market in your city.
					</p>
				{/if}

				{#if $page.url.hash.match(/#help-astronomy/)}
					<h2 class="mt-8">Astronomy</h2>
					<p>When you roll the dice you can reroll AND set one die to a face of your choice.</p>
				{/if}

				{#if $page.url.hash.match(/#help-masonry/)}
					<h2 class="mt-8">Masonry</h2>
					<p>From now on all your existing and future buildings have 1 Hit Point more.</p>
				{/if}

				{#if $page.url.hash.match(/#help-coinage/)}
					<h2 class="mt-8">Coinage</h2>
					<p>
						Immediately before resolving the TRADE event, you gain 1 gold for each MARKET you own.
					</p>
				{/if}
			</article>
		</div>
	</div>
</div>
