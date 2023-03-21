import type { CityDistrictEnumType } from '$lib/zod';

export type CityDistrictType = {
	id: CityDistrictEnumType;
	name: string;
	slots: number;
};

export const cityDistricts: CityDistrictType[] = [
	{ id: 'hightown', name: 'Hightown', slots: 4 },
	{ id: 'mountainside', name: 'Mountainside', slots: 6 },
	{ id: 'theGrove', name: 'The Grove', slots: 7 },
	{ id: 'countryDistrict', name: 'Country District', slots: 8 }
];
