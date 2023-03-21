import { actions } from '$lib/game/actions';
import { resources as r } from '$lib/game/resources';
import { buildings as b } from '$lib/game/buildings';
import { enemies as e } from '$lib/game/enemies';
import { defaults } from '$lib/game/defaults';
import { cityDistricts as c } from '$lib/game/cityDistricts';
import { advancements as y } from '$lib/game/advancements';
import {
	type DieEnumType,
	type BuildingEnumType,
	type ActionEnumType,
	type EnemyEnumType,
	type CityDistrictEnumType,
	type ResourceEnumType,
	type AdvancementEnumType,
	EnemyEnumSchema,
	DieEnumSchema,
	BuildingEnumSchema,
	CityDistrictEnumSchema,
	type State
} from '$lib/zod';
import type { ActionType } from '$lib/game/actions';
import type { ResourceType } from '$lib/game/resources';
import type { BuildingType } from '$lib/game/buildings';
import type { EnemyType } from '$lib/game/enemies';
import type { AdvancementType } from '$lib/game/advancements';
import type { CityDistrictType } from '$lib/game/cityDistricts';
import z from 'zod';

export const helpers = {
	filter: {
		citySlots: {
			// Return the citySlots for a given cityDistrictId
			byCityDistrictId: (citySlots: BuildingEnumType[], cityDistrictId: CityDistrictEnumType) =>
				citySlots.reduce(
					(result: BuildingEnumType[], buildingId, slotIndex) =>
						helpers.find.cityDistrictId.fromSlotIndex(slotIndex) === cityDistrictId
							? [...result, buildingId]
							: result,
					[]
				),
			// Return an object with all citydistrictIds and respective citySlots
			byCityDistrict: (citySlots: BuildingEnumType[]) =>
				Object.values(CityDistrictEnumSchema.Values).reduce(
					(result: { [key in CityDistrictEnumType]?: BuildingEnumType[] }, cityDistrictId) => ({
						...result,
						[cityDistrictId]: helpers.filter.citySlots.byCityDistrictId(citySlots, cityDistrictId)
					}),
					{}
				)
		}
	},
	dice: {
		// Return object with the full dice in various formats
		format: (dice: DieEnumType[]) =>
			dice.reduce(
				(
					result: {
						full: { index: number; die: DieEnumType }[];
						set: { index: number; die: DieEnumType }[];
						remaining: { index: number; die: DieEnumType }[];
					},
					die,
					index
				) => {
					// Build array of full dice
					result.full.push({ index, die });

					if (!result.set.find((obj) => obj.die === die)) {
						// Build array with unique dice
						result.set.push({ index, die });
					} else {
						// Build array of duplicate dice
						result.remaining.push({ index, die });
					}

					return result;
				},
				{ full: [], set: [], remaining: [] }
			),
		set: (dice: DieEnumType[]): DieEnumType[] => [...new Set(dice)],
		roll: () =>
			Object.values(DieEnumSchema.Values)[
				Math.floor(Math.random() * Object.values(DieEnumSchema.Values).length)
			]
	},
	is: {
		aBuilding: (buildingId: BuildingEnumType) =>
			BuildingEnumSchema.safeParse(buildingId).success &&
			!defaults.nonBuildingIds.includes(buildingId),
		emptySlot: (buildingId: BuildingEnumType) => BuildingEnumSchema.Values.none === buildingId
	},
	// From https://stackoverflow.com/a/2450976/1435476
	shuffle: (array: string[]): string[] => {
		let currentIndex = array.length;
		let randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	},
	find: {
		cityDistrictSlotIndexes: {
			// Return an array of CityDistrict slotIndex with the highest building HitPoints, grouped by HitPoints
			highestHPInCityDistrictId: (
				citySlots: BuildingEnumType[],
				cityDistrictId: CityDistrictEnumType,
				hasMasonry: boolean
			) => {
				// Build an object with HPs and respective slotIndexes
				const hitPointsWithRespectiveIndexes = citySlots.reduce(
					(
						result: {
							[key in number]: number[];
						},
						citySlot,
						slotIndex
					) => {
						// Consider only those slots that belong to the cityDistrictId we want to inspect
						if (
							helpers.find.cityDistrictId.fromSlotIndex(slotIndex) === cityDistrictId &&
							// And only buildings
							helpers.is.aBuilding(citySlot)
						) {
							// Retrieve the HitPoints value
							const hitPoints =
								helpers.get.buildingById(citySlot).hitPoints +
								// Plus add 1 if we have unlocked MASONRY
								Number(hasMasonry);

							// Push the value in the format { hp: [index, index, ...] } so we need to initiate the array the first time
							(result[hitPoints] || (result[hitPoints] = [])).push(slotIndex);
						}

						return result;
					},
					{}
				);

				// Find the higest hitpoint
				const highestHitPoint = Math.max(
					...Object.keys(hitPointsWithRespectiveIndexes).map(Number)
				);

				// Finally return an array of slotIndexes that have the highest HPs - or an empty array if we did not find any building
				return hitPointsWithRespectiveIndexes[highestHitPoint] || [];
			},
			// Find all buildings (that is, exlude trees and empty) given list of cityDistrictIds
			withOccupied: {
				inCityDistrictIds: (
					cityDistrictIds: CityDistrictEnumType[],
					citySlots: BuildingEnumType[]
				) =>
					// Iterate citySlots
					citySlots.reduce(
						(result: number[], citySlot, slotIndex) =>
							result.concat(
								// If the slot is a building
								helpers.is.aBuilding(citySlot) &&
									// And belongs to the cityDistrictId that we are interested in
									cityDistrictIds.includes(helpers.find.cityDistrictId.fromSlotIndex(slotIndex))
									? // Then return the slotIndex
									  slotIndex
									: []
							),
						[]
					)
			},
			withBuildingId: {
				// Find a abuildinh in the city and return the respective slotIndexes
				inCitySlots: (citySlots: BuildingEnumType[], buildingId: BuildingEnumType) =>
					// Iterate citySlots
					citySlots.reduce(
						(result: number[], citySlot, slotIndex) =>
							result.concat(
								// If the slot equals the building we are looking for
								citySlot === buildingId
									? // Then return the slotIndex
									  slotIndex
									: []
							),
						[]
					),
				// Find a building in a given list of cityDistrictIds
				inCityDistrictIds: (
					cityDistrictIds: CityDistrictEnumType[],
					citySlots: BuildingEnumType[],
					buildingId: BuildingEnumType
				) =>
					// Iterate citySlots
					citySlots.reduce(
						(result: number[], citySlot, slotIndex) =>
							result.concat(
								// If the slot equals the building we are looking for
								citySlot === buildingId &&
									// And belongs to the cityDistrictId that we are interested in
									cityDistrictIds.includes(helpers.find.cityDistrictId.fromSlotIndex(slotIndex))
									? // Then return the slotIndex
									  slotIndex
									: []
							),
						[]
					)
			}
		},
		// Return the cityDistrictId based on the slotIndex provided
		cityDistrictId: {
			fromSlotIndex: (slotIndex: number): CityDistrictEnumType => {
				if (z.number().min(0).max(3).safeParse(slotIndex).success)
					return CityDistrictEnumSchema.Values.hightown;
				if (z.number().min(4).max(9).safeParse(slotIndex).success)
					return CityDistrictEnumSchema.Values.mountainside;
				if (z.number().min(10).max(16).safeParse(slotIndex).success)
					return CityDistrictEnumSchema.Values.theGrove;
				if (z.number().min(17).max(24).safeParse(slotIndex).success)
					return CityDistrictEnumSchema.Values.countryDistrict;

				throw new Error();
			}
		},
		cityDistrictIds: {
			// Find a specific buildingId in da city
			withBuildingId: (buildingId: BuildingEnumType, citySlots: BuildingEnumType[]) =>
				// return an array of unique cityDistrictIds
				[
					...new Set(
						// Iterate citySlots
						citySlots.reduce(
							(result: CityDistrictEnumType[], citySlot, slotIndex) =>
								result.concat(
									// If the slot equals the building we are looking for
									citySlot === buildingId
										? // Return the relevant cityDistrictId
										  helpers.find.cityDistrictId.fromSlotIndex(slotIndex)
										: []
								),
							[]
						)
					)
				],
			// Find those districts that do not have a specific buildingId
			withoutBuildingId: (buildingId: BuildingEnumType, citySlots: BuildingEnumType[]) =>
				// return an array of unique cityDistrictIds
				[
					...new Set(
						// Iterate district
						Object.entries(helpers.filter.citySlots.byCityDistrict(citySlots)).reduce(
							(result: CityDistrictEnumType[], [cityDistrictId, districtSlots]) =>
								result.concat(
									// In each district look if we find at least one
									districtSlots.find((citySlot) => citySlot === buildingId)
										? []
										: // If not, we can return the districtId
										  (cityDistrictId as CityDistrictEnumType)
								),

							[]
						)
					)
				],
			// Check what cityDistricts have occupied slots
			withOccupied: (citySlots: BuildingEnumType[]) =>
				// return an array of unique cityDistrictIds
				[
					...new Set(
						// Iterate citySlots
						citySlots.reduce(
							(result: CityDistrictEnumType[], citySlot, slotIndex) =>
								result.concat(
									// Check if we are dealing with a building (that is, exlude trees and empty slots)
									helpers.is.aBuilding(citySlot)
										? // Return the relevant cityDistrictId
										  helpers.find.cityDistrictId.fromSlotIndex(slotIndex)
										: []
								),
							[]
						)
					)
				],

			// Check what cityDistricts have more than X amount of occupied slots
			withMoreThanOccupied: (amount: number, citySlots: BuildingEnumType[]) =>
				// Iterate district by district
				Object.entries(helpers.filter.citySlots.byCityDistrict(citySlots)).reduce(
					(result: CityDistrictEnumType[], [cityDistrictId, citySlots]) =>
						result.concat(
							// If we have the required amount
							z.number().min(amount).safeParse(helpers.count.occupiedCitySlots(citySlots)).success
								? // Keep the relevant cityDistrictId in our result array
								  (cityDistrictId as CityDistrictEnumType)
								: []
						),
					[]
				),
			// We use this function to isolate those districts that tick multiple conditions
			overlapping: (...cityDistrictIds: CityDistrictEnumType[]) => {
				const duplicates: CityDistrictEnumType[] = [];
				const set = new Set();

				// Loop over each item to find the duplicates
				cityDistrictIds.forEach((cityDistrictId) => {
					if (set.has(cityDistrictId)) {
						duplicates.push(cityDistrictId);
					} else {
						// Keep an array of unique values to use it as a source of truth to check which values we already have
						set.add(cityDistrictId);
					}
				});

				return duplicates;
			}
		},
		enemyIds: {
			// Return array of enemyIds that have more than X troops
			withMoreThanXTroops: (state: State, amount: number) =>
				Object.values(EnemyEnumSchema.Values).filter(
					(enemyId) => z.number().min(amount).safeParse(state[enemyId]).success
				),
			// Return array of enemies that do not already have troops assigned
			withoutTroops: (state: State) =>
				Object.values(EnemyEnumSchema.Values).reduce(
					(result: EnemyEnumType[], enemyId) =>
						!z.number().positive().safeParse(state[enemyId]).success
							? [...result, enemyId]
							: result,

					[]
				)
		},
		// Retreive the list of relevant actions related to a selected die
		actionsFromDie: (die: DieEnumType) =>
			defaults.actionsFromDie[die].map((actionId) =>
				// defaults.actionsFromDie[helpers.dice.set(dice)[selectedDie]].map((actionId) =>
				helpers.get.actionById(actionId as ActionEnumType)
			),
		// Find the die face (one, two, ... or six) based on a given action
		dieFromAction: (action: ActionEnumType) =>
			Object.keys(defaults.actionsFromDie).find((key) =>
				defaults.actionsFromDie[key as DieEnumType].includes(action)
			)
	},
	count: {
		occupiedCitySlots: (citySlots: BuildingEnumType[]) =>
			citySlots.reduce(
				(result, citySlot) => (helpers.is.aBuilding(citySlot) ? result + 1 : result),
				0
			),
		occupiedSlotsInDistrictId: (
			citySlots: BuildingEnumType[],
			cityDistrictId: CityDistrictEnumType
		) =>
			helpers.count.occupiedCitySlots(
				helpers.filter.citySlots.byCityDistrictId(citySlots, cityDistrictId)
			),
		buildingIdInCitySlots: (citySlots: BuildingEnumType[], buildingId: BuildingEnumType) =>
			citySlots.reduce(
				(result, citySlot) =>
					BuildingEnumSchema.safeParse(buildingId).success && citySlot === buildingId
						? result + 1
						: result,
				0
			),
		buildingIdInDistrictId: (
			citySlots: BuildingEnumType[],
			buildingId: BuildingEnumType,
			cityDistrictId: CityDistrictEnumType
		) =>
			helpers.count.buildingIdInCitySlots(
				helpers.filter.citySlots.byCityDistrictId(citySlots, cityDistrictId),
				buildingId
			),
		buildingIdInDistrictIds: (
			citySlots: BuildingEnumType[],
			buildingId: BuildingEnumType,
			cityDistrictIds: CityDistrictEnumType[]
		) =>
			cityDistrictIds.reduce(
				(result, cityDistrictId) =>
					result + helpers.count.buildingIdInDistrictId(citySlots, buildingId, cityDistrictId),
				0
			)
	},
	text: {
		addS: (number: number, singularText: string) => {
			// Prepare our return array, which we will convert to string at the end
			const result = [];

			// If the number provided is > 0, show the number
			if (z.number().positive().safeParse(number).success) {
				result.push(number);
			} else {
				// Otherwise show a 'no'
				result.push('no');
			}

			// Add a space between the value and the word
			result.push(' ');

			// Now add the passed word
			result.push(singularText);

			// And finally add a 's' if the number is >= 2
			if (z.number().min(2).safeParse(number).success) {
				result.push('s');
			}

			return result.join('');
		},
		commaSeparatedlist: (array: (string | undefined)[], or = false): string | void => {
			// Remove null or undefined items
			array = array.filter((item) => !!item);

			// If we are not passing anything, return nothing
			if (!array.length) return;

			// If the array has more than 1 element
			if (array.length > 1) {
				// Remove the last item, so that we can add it manually to have the "and" or the "or"
				const last = array.pop();

				return (or ? 'either ' : '') + array.join(', ') + (or ? ' or ' : ' and ') + last;
			}

			// Otherwise just return that one element as a string
			return array[0] as string;
		}
	},
	game: {
		seasonMultiplier: (turn: State['turn']) => {
			if (z.number().min(0).max(3).safeParse(turn).success) return 2;
			if (z.number().min(4).max(6).safeParse(turn).success) return 3;
			if (z.number().min(7).max(9).safeParse(turn).success) return 2;
			return 1; // which means if (turn > 9)
		},
		youLose: (state: State) => {
			// Return true if there is a losing condition
			if (
				// All the resources drop to zero
				state.food === 0 ||
				state.wood === 0 ||
				state.gold === 0 ||
				// all 3 enemy armies reach the maximum number of 18 units
				(state.outlawsAlliance === 18 &&
					state.blackrockClan === 18 &&
					state.nomadicRiders === 18) ||
				// Lose all the buildings in Hightown district
				helpers.count.occupiedSlotsInDistrictId(
					state.citySlots,
					CityDistrictEnumSchema.Values.hightown
				) === 0 ||
				// at the end of the twelfth turn, marked with a skull @TODO
				state.turn === 13
			)
				return true;

			// Return false if there is a losing configuration
			return false;
		},
		isCulturalSupremacy: (state: State) => state.unlockedAdvancements.length >= 9,
		isMilitarySupremacy: (state: State) =>
			helpers.count.buildingIdInCitySlots(state.citySlots, 'castle') === 4 &&
			helpers.count.buildingIdInCitySlots(state.citySlots, 'tavern') >= 2 &&
			state.outlawsAlliance <= 12 &&
			state.blackrockClan <= 12 &&
			state.nomadicRiders <= 12,
		isEconomicSupremacy: (state: State) =>
			helpers.count.buildingIdInCitySlots(state.citySlots, 'market') >= 3 && state.gold >= 12
	},
	add: {
		resource: (current: number, amount: number) => Math.min(current + amount, defaults.maxResource),
		enemy: (current: number, amount: number) => Math.min(current + amount, defaults.maxEnemyTroop),
		cityDistrictSlot: (
			buildingId: BuildingEnumType,
			citySlots: BuildingEnumType[],
			slotIndexes: number[]
		) => citySlots.map((content, index) => (slotIndexes.includes(index) ? buildingId : content))
	},
	remove: {
		resource: (current: number, amount: number) => Math.max(current - amount, 0),
		enemy: (current: number, amount: number) => Math.max(current - amount, 0),
		cityDistrictSlot: (citySlots: BuildingEnumType[], slotIndex: number) =>
			citySlots.map((buildingId, index) =>
				index === slotIndex ? BuildingEnumSchema.Values.none : buildingId
			)
	},
	get: {
		actionById: (actionId: ActionEnumType) =>
			actions.find(({ id }) => id === actionId) as ActionType,
		resourceById: (resourceId: ResourceEnumType) =>
			r.find(({ id }) => id === resourceId) as ResourceType,
		buildingById: (buildingId: BuildingEnumType) =>
			b.find(({ id }) => id === buildingId) as BuildingType,
		enemyById: (enemyId: EnemyEnumType) => e.find(({ id }) => id === enemyId) as EnemyType,
		advancementById: (advancementId: AdvancementEnumType) =>
			y.find(({ id }) => id === advancementId) as AdvancementType,
		cityDistrictById: (cityDistrictId: CityDistrictEnumType) =>
			c.find(({ id }) => id === cityDistrictId) as CityDistrictType,
		// Return an object of cityDistrictIds with their slots
		slotsByCityDistricts: (citySlots: BuildingEnumType[]) =>
			citySlots.reduce(
				(
					result: {
						[key in CityDistrictEnumType]: BuildingEnumType[];
					},
					slotBuildingId,
					slotIndex
				) => {
					// Set the current cityDistrictId based on the slotIndex value
					const cityDistrictId = helpers.find.cityDistrictId.fromSlotIndex(slotIndex);

					return { ...result, [cityDistrictId]: [...result[cityDistrictId], slotBuildingId] };
				},
				{
					hightown: [],
					mountainside: [],
					theGrove: [],
					countryDistrict: []
				}
			)
	}
};
