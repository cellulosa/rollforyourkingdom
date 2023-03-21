import {
	BuildingEnumSchema,
	FightEnumSchema,
	ActionEnumSchema,
	EnemyEnumSchema,
	type State,
	type BuildingEnumType
} from '$lib/zod';
import { defaults } from './defaults';
import { helpers } from './helpers';

export const newGame: Partial<State> = {
	startTime: new Date(),
	turn: 1,
	action: ActionEnumSchema.Values.rollTheDice,
	dice: [],
	playedDice: [],
	wood: defaults.wood,
	food: defaults.food,
	gold: defaults.gold,
	// Allocate 1, 2 and 3 troops randomly to enemyes
	...helpers.shuffle(Object.values(EnemyEnumSchema.Values)).reduce(
		(result, enemyId, index) => ({
			...result,
			[enemyId]: index + 1
		}),
		{
			[EnemyEnumSchema.Values.blackrockClan]: 0,
			[EnemyEnumSchema.Values.nomadicRiders]: 0,
			[EnemyEnumSchema.Values.outlawsAlliance]: 0
		}
	),
	// Fill the 25 cityDistrict slots
	citySlots: [
		// Hightown
		...(helpers.shuffle([
			BuildingEnumSchema.Values.castle,
			BuildingEnumSchema.Values.none,
			BuildingEnumSchema.Values.none,
			BuildingEnumSchema.Values.none
		]) as BuildingEnumType[]),
		// Mountainside
		...(helpers.shuffle([
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.quarry,
			BuildingEnumSchema.Values.none,
			BuildingEnumSchema.Values.none
		]) as BuildingEnumType[]),
		// The Grove
		...(helpers.shuffle([
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.lumberjack,
			BuildingEnumSchema.Values.lumberjack,
			BuildingEnumSchema.Values.none
		]) as BuildingEnumType[]),
		// Country District
		...(helpers.shuffle([
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.tree,
			BuildingEnumSchema.Values.farm,
			BuildingEnumSchema.Values.farm,
			BuildingEnumSchema.Values.farm,
			BuildingEnumSchema.Values.none,
			BuildingEnumSchema.Values.none,
			BuildingEnumSchema.Values.none
		]) as BuildingEnumType[])
	],
	// And then various default-resetted values (used also when moving to a new round)
	fight: FightEnumSchema.Values.stepZero,
	invadingHightown: false,
	assignedBarbariansAtGate: 0,
	built: [],
	traded: 0,
	mercenaryTroopsHired: 0,
	plagueErased: [],
	unlockedAdvancements: [],
	paidToThieves: [],
	dieReRolledOrChanged: null,
	extraGoldForCoinage: false
};
