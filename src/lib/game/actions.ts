import type { ActionEnumType } from '$lib/zod';

export type ActionType = {
	id: ActionEnumType;
	name: string;
	next: ActionEnumType;
};

export const actions: ActionType[] = [
	{
		id: 'rollTheDice',
		name: 'Roll the dice',
		next: 'reRollOrChange'
	},
	{
		id: 'reRollOrChange',
		name: 'Re-roll or change',
		next: 'playDie'
	},
	{
		id: 'reRollOrChangeForAstronomy',
		name: 'Re-roll or change',
		next: 'playDie'
	},
	{
		id: 'playDie',
		name: 'Play a die',
		next: 'feedTheHungry'
	},
	{
		id: 'feedTheHungry',
		name: 'Feed the hungry',
		next: 'barbariansAtGate'
	},
	{
		id: 'barbariansAtGate',
		name: 'Barbarians at gate',
		next: 'claimVictory'
	},
	{
		id: 'claimVictory',
		name: 'Claim victory',
		next: 'rollTheDice'
	},
	{
		id: 'harvest',
		name: 'Harvest',
		next: 'nomadsAttack'
	},
	{
		id: 'nomadsAttack',
		name: 'Nomads attack',
		next: 'doneWithDie'
	},
	{
		id: 'collect',
		name: 'Collect',
		next: 'outlawsAttack'
	},
	{
		id: 'outlawsAttack',
		name: 'Outlaws attack',
		next: 'doneWithDie'
	},
	{
		id: 'mineGold',
		name: 'Mine gold',
		next: 'blackrockClanAttacks'
	},
	{
		id: 'blackrockClanAttacks',
		name: 'Blackrock clan attacks',
		next: 'doneWithDie'
	},
	{
		id: 'trade',
		name: 'Trade',
		next: 'mercenaryTroop'
	},
	{
		id: 'mercenaryTroop',
		name: 'Mercenary troop',
		next: 'plague'
	},
	{
		id: 'plague',
		name: 'Plague',
		next: 'doneWithDie'
	},
	{
		id: 'build',
		name: 'Build',
		next: 'attack'
	},
	{
		id: 'attack',
		name: 'Attack',
		next: 'thieves'
	},
	{
		id: 'thieves',
		name: 'Thieves',
		next: 'doneWithDie'
	},
	{
		id: 'worship',
		name: 'Worship',
		next: 'research'
	},
	{
		id: 'research',
		name: 'Research',
		next: 'riot'
	},
	{
		id: 'riot',
		name: 'Riot',
		next: 'doneWithDie'
	}
];
