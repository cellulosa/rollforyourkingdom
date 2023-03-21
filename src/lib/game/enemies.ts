import type { EnemyEnumType } from '$lib/zod';

export type EnemyType = {
	id: EnemyEnumType;
	name: string;
};

export const enemies: EnemyType[] = [
	{
		id: 'outlawsAlliance',
		name: 'Outlaws Alliance'
	},
	{
		id: 'blackrockClan',
		name: 'Blackrock Clan'
	},
	{
		id: 'nomadicRiders',
		name: 'Nomadic Riders'
	}
];
