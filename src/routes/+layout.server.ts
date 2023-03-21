import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();

	return {
		session,
		state: router.createCaller(await createContext(event)).state.load(session?.user?.id)
	};
};
