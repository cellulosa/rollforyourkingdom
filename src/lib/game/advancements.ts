import type { AdvancementEnumType, BuildingEnumType } from '$lib/zod';

export type AdvancementType = {
	id: AdvancementEnumType;
	name: string;
	cost: number;
	requresBuildingId: BuildingEnumType | null;
	requresAdvancement: AdvancementEnumType | null;
	min: number | null;
	effect: string;
};

export const advancements: AdvancementType[] = [
	{
		id: 'cropRotation',
		name: 'Crop rotation',
		cost: 1, // 1 Gold
		requresBuildingId: 'farm',
		requresAdvancement: null,
		min: 3, // at least 3 farms
		effect: 'When you resolve a HARVEST event, each FARM produces 1 FOOD more'
	},
	{
		id: 'improvedWoodaxe',
		name: 'Improved woodaxe',
		cost: 1,
		requresBuildingId: 'lumberjack',
		requresAdvancement: null,
		min: 2,
		effect: 'When you resolve a COLLECT event, each LUMBERJACK produces 1 WOOD more'
	},
	{
		id: 'smelting',
		name: 'Smelting',
		cost: 1,
		requresBuildingId: 'quarry',
		requresAdvancement: null,
		min: 1,
		effect: 'When you resolve a MINE GOLD event, each QUARRY produces 1 GOLD more'
	},
	{
		id: 'cavalry',
		name: 'Cavalry',
		cost: 1,
		requresBuildingId: null,
		requresAdvancement: 'cropRotation',
		min: null,
		effect:
			"When you ATTACK you can split the damage from your CASTLES between different ENEMY ARMIES; if you don't split the damage, you deal 3 extra damage"
	},
	{
		id: 'archers',
		name: 'Archers',
		cost: 1,
		requresBuildingId: null,
		requresAdvancement: 'improvedWoodaxe',
		min: null,
		effect: 'When the ENEMIES invade a DISTRICT with a CASTLE, in Phase 1 they lose 3 units more'
	},
	{
		id: 'steelWeaponry',
		name: 'Steel weaponry',
		cost: 1,
		requresBuildingId: null,
		requresAdvancement: 'smelting',
		min: null,
		effect:
			'When you resolve MERCENARY TROOPS or ATTACK actions, you can pay 1 extra Gold to eliminate 1 extra Enemy from all the Armies who suffered at least one loss during the action'
	},
	{
		id: 'medicine',
		name: 'Medicine',
		cost: 2,
		requresBuildingId: null,
		requresAdvancement: 'cropRotation',
		min: null,
		effect: 'Ignore the Plague event in all districts until you have at least 1 Abbey in your city'
	},
	{
		id: 'fyrdMilitia',
		name: 'Fyrd militia',
		cost: 2,
		requresBuildingId: null,
		requresAdvancement: 'improvedWoodaxe',
		min: null,
		effect: 'Ignore the Riot event in all districts until you have at least 1 Tavern in your city'
	},
	{
		id: 'guildOfThieves',
		name: 'Guild of thieves',
		cost: 2,
		requresBuildingId: null,
		requresAdvancement: 'smelting',
		min: null,
		effect:
			'Ignore the Thieves event in all districts until you have at least 1 Market in your city'
	},
	{
		id: 'astronomy',
		name: 'Astronomy',
		cost: 3,
		requresBuildingId: null,
		requresAdvancement: 'cropRotation',
		min: null,
		effect: 'When you roll the dice you can reroll AND set one die to a face of your choice'
	},
	{
		id: 'masonry',
		name: 'Masonry',
		cost: 3,
		requresBuildingId: null,
		requresAdvancement: 'improvedWoodaxe',
		min: null,
		effect: 'From now on all your existing and future buildings have 1 Hit Point more'
	},
	{
		id: 'coinage',
		name: 'Coinage',
		cost: 3,
		requresBuildingId: null,
		requresAdvancement: 'smelting',
		min: null,
		effect: 'Immediately before resolving the TRADE event, you gain 1 gold for each MARKET you own'
	}
];
