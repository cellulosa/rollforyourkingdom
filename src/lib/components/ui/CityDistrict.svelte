<script lang="ts">
	import type { CityDistrictEnumType } from '$lib/zod';
	import { helpers } from '$lib/game/helpers';

	export let cityDistrictId: CityDistrictEnumType;

	const cityDistrict = helpers.get.cityDistrictById(cityDistrictId);
</script>

<div
	class="badge"
	class:bg-fuchsia-400={cityDistrictId === 'hightown'}
	class:text-fuchsia-800={cityDistrictId === 'hightown'}
	class:border-fuchsia-800={cityDistrictId === 'hightown'}
	class:bg-emerald-400={cityDistrictId === 'mountainside'}
	class:text-emerald-800={cityDistrictId === 'mountainside'}
	class:border-emerald-800={cityDistrictId === 'mountainside'}
	class:bg-lime-400={cityDistrictId === 'theGrove'}
	class:text-lime-800={cityDistrictId === 'theGrove'}
	class:border-lime-800={cityDistrictId === 'theGrove'}
	class:bg-indigo-400={cityDistrictId === 'countryDistrict'}
	class:text-indigo-800={cityDistrictId === 'countryDistrict'}
	class:border-indigo-800={cityDistrictId === 'countryDistrict'}
>
	{cityDistrict.name}
</div>
