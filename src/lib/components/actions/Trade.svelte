<script lang="ts">
	import { highlightBuildingIds, state } from '$lib/stores';
	import { helpers } from '$lib/game/helpers';
	import Message from '$lib/components/ui/Message.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowsRightLeft } from '@steeze-ui/heroicons';
	import {
		AdvancementEnumSchema,
		BuildingEnumSchema,
		ResourceEnumSchema,
		type ResourceEnumType
	} from '$lib/zod';

	// Check if we have markets in the city
	const countMarketsInCitySlots = helpers.count.buildingIdInCitySlots(
		$state.citySlots,
		BuildingEnumSchema.Values.market
	);

	// If there are any, highlight all markets
	if (countMarketsInCitySlots > 0) $highlightBuildingIds = [BuildingEnumSchema.Values.market];

	// We can trade food or wood (for gold)
	const payResources: ResourceEnumType[] = [
		ResourceEnumSchema.Values.food,
		ResourceEnumSchema.Values.wood
	];
	let resourceSelected = payResources[0];

	// We use this value to dictate whether we want to get or pay gold
	let payGold = false;
	const switchResources = () => (payGold = !payGold);

	// The allowed amounts that we can trade
	const payFood = [3, 6, 15];
	const payWood = [2, 4, 10];
	const getGold = [1, 2, 5];

	// Setting default values
	let payAmount = payFood[0];
	let getAmount = getGold[0];

	const increase = () => {
		// We use different values depending on whether we want to trade food or wood
		if (resourceSelected === ResourceEnumSchema.Values.food) {
			const index = payFood.indexOf(payAmount);
			if (index >= 0 && index < payFood.length - 1) {
				payAmount = payFood[index + 1];
				getAmount = getGold[index + 1];
			} else {
				payAmount = payFood[0];
				getAmount = getGold[0];
			}
		} else if (resourceSelected === ResourceEnumSchema.Values.wood) {
			const index = payWood.indexOf(payAmount);
			if (index >= 0 && index < payWood.length - 1) {
				payAmount = payWood[index + 1];
				getAmount = getGold[index + 1];
			} else {
				payAmount = payWood[0];
				getAmount = getGold[0];
			}
		}
	};

	// When we select a resource from the dropdown, we reset the values to their default value
	const handleChange = () => {
		if (resourceSelected === ResourceEnumSchema.Values.food) {
			payAmount = payFood[0];
		} else if (resourceSelected === ResourceEnumSchema.Values.wood) {
			payAmount = payWood[0];
		}
		getAmount = getGold[0];
	};

	// Check if we unlocked COINAGE
	const hasCoinage = $state.unlockedAdvancements.includes(AdvancementEnumSchema.Values.coinage);

	// If we do, gain 1 gold for each Market owned (once)
	if (hasCoinage && countMarketsInCitySlots > 0 && !$state.extraGoldForCoinage)
		state.updateState(
			{
				gold: helpers.add.resource($state.gold, countMarketsInCitySlots),
				extraGoldForCoinage: true
			},
			$state
		);

	// Move to the next action
	const handleClick = () =>
		state.updateState(
			{
				action: helpers.get.actionById($state.action).next
			},
			$state
		);

	// Trade
	const trade = () => {
		// Does not allow to trade unless we have enough resources
		if (
			(payGold && $state.gold <= getAmount) ||
			(!payGold && $state[resourceSelected] <= payAmount)
		)
			return;

		state.updateState(
			{
				...(payGold
					? {
							gold: helpers.remove.resource($state.gold, getAmount),
							[resourceSelected]: helpers.add.resource($state[resourceSelected], payAmount)
					  }
					: {
							[resourceSelected]: helpers.remove.resource($state[resourceSelected], payAmount),
							gold: helpers.add.resource($state.gold, getAmount)
					  }),
				// Increase traded count
				traded: $state.traded + 1
			},
			$state
		);
	};
</script>

{#if countMarketsInCitySlots > 0}
	{#if hasCoinage}
		<Message>
			Since you have unlocked {helpers.get.advancementById(AdvancementEnumSchema.Values.coinage)
				.name}, you gained {helpers.text.addS(
				countMarketsInCitySlots,
				ResourceEnumSchema.Values.gold
			)}.
		</Message>
	{/if}

	<Message>
		You have {helpers.text.addS(countMarketsInCitySlots, BuildingEnumSchema.Values.market)},
		therefore you can perform up to {helpers.text.addS(countMarketsInCitySlots, 'trading')}. Click
		on the resource numbers to change their quantities and on the switcher if you wish to pay or get
		gold.
	</Message>

	<Message>
		{#if $state.traded < countMarketsInCitySlots}
			You can still perform {helpers.text.addS(
				countMarketsInCitySlots - $state.traded,
				'trading goods action'
			)}.
		{:else}
			All done! You used all your trading actions.
		{/if}
	</Message>

	{#if $state.traded < countMarketsInCitySlots}
		<Message>
			<div class="flex">
				<div class="w-1/3 flex flex-col min-w-fit">
					<div class="bg-neutral hover:bg-neutral-focus rounded-lg">
						<button
							class="flex flex-col w-full uppercase text-neutral-content font-medium pt-3 px-3"
							on:click={increase}
						>
							<p>
								{#if payGold}Get{:else}Pay{/if}
							</p>
							<span class="countdown text-6xl">
								<span style="--value:{payAmount};" class="w-full text-center" />
							</span>
						</button>
						<div class="mb-3 mx-3">
							<select
								class="select select-bordered w-full text-black text-center uppercase"
								bind:value={resourceSelected}
								on:change={handleChange}
							>
								{#each payResources as resource}
									<option value={resource}>
										{helpers.get.resourceById(resource).name}
									</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
				<div class="w-1/3 mx-1 min-w-fit">
					<button class="btn w-full h-full place-items-center p-3" on:click={switchResources}>
						<Icon src={ArrowsRightLeft} theme="outline" class="h-10 w-10" />
					</button>
				</div>
				<div class="w-1/3 min-w-fit">
					<button
						class="bg-neutral hover:bg-neutral-focus rounded-lg p-3 h-full uppercase text-neutral-content font-medium grid content-start"
						on:click={increase}
					>
						<p class="top">
							{#if payGold}Pay{:else}Get{/if}
						</p>
						<span class="countdown text-6xl">
							<span style="--value:{getAmount};" class="w-full text-center" />
						</span>
						<p class="my-2">{ResourceEnumSchema.Values.gold}</p>
					</button>
				</div>
			</div>
		</Message>
	{/if}
{:else}
	<Message>Since you have no market, you cannot do any trading.</Message>
{/if}

{#if $state.traded < countMarketsInCitySlots}
	<Button pulse={true} handleClick={trade}>
		{#if payGold}
			Pay {helpers.text.addS(getAmount, ResourceEnumSchema.Values.gold)} and get {helpers.text.addS(
				payAmount,
				resourceSelected
			)}!
		{:else}
			Pay {helpers.text.addS(payAmount, resourceSelected)} and get {helpers.text.addS(
				getAmount,
				ResourceEnumSchema.Values.gold
			)}!
		{/if}
	</Button>
{/if}

<Button pulse={true} {handleClick}>Next</Button>
