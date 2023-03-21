import type { ResourceEnumType } from '$lib/zod';

export type ResourceType = {
	id: ResourceEnumType;
	name: string;
};

export const resources: ResourceType[] = [
	{
		id: 'wood',
		name: 'Wood'
	},
	{
		id: 'food',
		name: 'Food'
	},
	{
		id: 'gold',
		name: 'Gold'
	}
];
