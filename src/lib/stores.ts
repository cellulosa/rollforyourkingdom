import { get, writable } from 'svelte/store';
import { trpc } from '$lib/trpc/client';
import { TRPCClientError } from '@trpc/client';
import { alert } from '$lib/alert';
import type {
	State,
	CityDistrictEnumType,
	BuildingEnumType,
	ResourceEnumType,
	EnemyEnumType
} from '$lib/zod';

// Show loader when we persist data on the db
export const loading = writable<boolean>(false);

// Animate pulse slots that can be interacted with
export const pulseCityDistrictSlotIndex = writable<number[]>([]);
export const pulseCityDistrictIds = writable<CityDistrictEnumType[]>([]);
export const pulseEnemyIds = writable<EnemyEnumType[]>([]);
export const pulseBuildingIds = writable<BuildingEnumType[]>([]);
export const pulseResourceIds = writable<ResourceEnumType[]>([]);

// Highlight slots on the map
export const highlightCityDistrictSlotIndexes = writable<number[]>([]);
export const highlightCityDistrictIds = writable<CityDistrictEnumType[]>([]);
export const highlightEnemyIds = writable<EnemyEnumType[]>([]);
export const highlightBuildingIds = writable<BuildingEnumType[]>([]);
export const highlightResourceIds = writable<ResourceEnumType[]>([]);

// Store to manage the game state
export const state = (() => {
	const { subscribe, set } = writable<State>();

	return {
		subscribe,
		setState: (newState: State) => set(newState),
		// function to update data optimistically whilst saving it to the database
		updateState: async (update: Partial<State>, prevState: State) => {
			// Create a newState object so that we have both the previous and new new one stored
			const newState = { ...prevState, ...update };

			// Save store values in case we need to roll back
			const prevPulseCityDistrictSlotIndex = get(pulseCityDistrictSlotIndex);
			const prevPulseCityDistrictIds = get(pulseCityDistrictIds);
			const prevPulseEnemyIds = get(pulseEnemyIds);
			const prevPulseBuildingIds = get(pulseBuildingIds);
			const prevPulseResourceIds = get(pulseResourceIds);
			const prevhighlightCityDistrictSlotIndexes = get(highlightCityDistrictSlotIndexes);
			const prevHighlightCityDistrictIds = get(highlightCityDistrictIds);
			const prevHighlightEnemyIds = get(highlightEnemyIds);
			const prevHighlightBuildingIds = get(highlightBuildingIds);
			const prevHighlightResourceIds = get(highlightResourceIds);

			// Set the loading state to show a loader on the UI
			loading.set(true);

			// Optimistic update
			set(newState);

			// Reset our UI stores
			pulseCityDistrictSlotIndex.set([]);
			pulseCityDistrictIds.set([]);
			pulseEnemyIds.set([]);
			pulseBuildingIds.set([]);
			pulseResourceIds.set([]);
			highlightCityDistrictSlotIndexes.set([]);
			highlightCityDistrictIds.set([]);
			highlightEnemyIds.set([]);
			highlightBuildingIds.set([]);
			highlightResourceIds.set([]);

			try {
				// Update database
				await trpc().state.save.mutate(newState);
			} catch (err) {
				// If something went wrong, roll back on the previous state
				set(prevState);

				// And roll back on the UI states too
				pulseCityDistrictSlotIndex.set(prevPulseCityDistrictSlotIndex);
				pulseCityDistrictIds.set(prevPulseCityDistrictIds);
				pulseEnemyIds.set(prevPulseEnemyIds);
				pulseBuildingIds.set(prevPulseBuildingIds);
				pulseResourceIds.set(prevPulseResourceIds);
				highlightCityDistrictSlotIndexes.set(prevhighlightCityDistrictSlotIndexes);
				highlightCityDistrictIds.set(prevHighlightCityDistrictIds);
				highlightEnemyIds.set(prevHighlightEnemyIds);
				highlightBuildingIds.set(prevHighlightBuildingIds);
				highlightResourceIds.set(prevHighlightResourceIds);

				// And show an error message
				if (err instanceof TRPCClientError) {
					alert.error(JSON.parse(err.message)[0].message);
				} else {
					alert.error(err as string);
				}
			} finally {
				// Hide loader
				loading.set(false);
			}
		}
	};
})();
