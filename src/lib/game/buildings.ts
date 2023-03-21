import type { BuildingEnumType, CityDistrictEnumType, ResourceEnumType } from '$lib/zod';

export type BuildingType = {
	id: BuildingEnumType;
	name: string;
	buildOnlyOn?: CityDistrictEnumType[];
	onePerDistrict: boolean;
	cost: {
		wood: number;
		food: number;
		gold: number;
	};
	allows: string[];
	hitPoints: number;
	consumes?: ResourceEnumType;
	produces?: ResourceEnumType;
};

export const buildings: BuildingType[] = [
	{
		id: 'none',
		name: 'Empty',
		onePerDistrict: false,
		hitPoints: 0,
		cost: {
			wood: 0,
			food: 0,
			gold: 0
		},
		allows: []
	},
	{
		id: 'tree',
		name: 'Tree',
		onePerDistrict: false,
		hitPoints: 0,
		cost: {
			wood: 0,
			food: 0,
			gold: 0
		},
		allows: []
	},
	{
		id: 'farm',
		name: 'Farm',
		onePerDistrict: false,
		cost: {
			wood: 2,
			food: 0,
			gold: 0
		},
		hitPoints: 1,
		produces: 'food',
		allows: []
	},
	{
		id: 'lumberjack',
		name: 'Lumberjack',
		onePerDistrict: false,
		buildOnlyOn: ['mountainside', 'theGrove'],
		cost: {
			wood: 2,
			food: 0,
			gold: 0
		},
		hitPoints: 1,
		produces: 'wood',
		allows: []
	},
	{
		id: 'quarry',
		name: 'Quarry',
		onePerDistrict: false,
		buildOnlyOn: ['mountainside'],
		cost: {
			wood: 3,
			food: 0,
			gold: 0
		},
		hitPoints: 1,
		produces: 'gold',
		allows: []
	},
	{
		id: 'castle',
		name: 'Castle',
		onePerDistrict: true, // Can only build 1 per district
		cost: {
			wood: 5,
			food: 4,
			gold: 2
		},
		allows: [],
		hitPoints: 5,
		consumes: 'food'
	},
	{
		id: 'market',
		name: 'Market',
		onePerDistrict: true,
		cost: {
			wood: 3,
			food: 2,
			gold: 0
		},
		hitPoints: 3,
		allows: ['trade'],
		consumes: 'food'
	},
	{
		id: 'abbey',
		name: 'Abbey',
		onePerDistrict: true,
		cost: {
			wood: 5,
			food: 0,
			gold: 2
		},
		hitPoints: 3,
		allows: ['worship', 'research'],
		consumes: 'food'
	},
	{
		id: 'tavern',
		name: 'Tavern',
		onePerDistrict: true,
		cost: {
			wood: 3,
			food: 5,
			gold: 0
		},
		hitPoints: 3,
		consumes: 'food',
		allows: []
	}
];
