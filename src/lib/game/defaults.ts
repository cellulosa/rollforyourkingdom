export const defaults = {
	maxTurn: 12,
	gameStages: 7,
	dice: 5, // How many dice to throw
	wood: 10,
	food: 6,
	gold: 4,
	maxResource: 18,
	maxEnemyTroop: 18,
	cityDistrictSlots: 25,
	buildUpTo: 3, // How many buildings can be built in the build action
	actionsFromDie: {
		one: ['harvest', 'nomadsAttack'],
		two: ['collect', 'outlawsAttack'],
		three: ['mineGold', 'blackrockClanAttacks'],
		four: ['trade', 'mercenaryTroop', 'plague'],
		five: ['build', 'attack', 'thieves'],
		six: ['worship', 'research', 'riot']
	},
	nonBuildingIds: ['none', 'tree']
};
