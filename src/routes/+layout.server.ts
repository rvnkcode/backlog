import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';

import type { LayoutServerLoad } from './$types';

export const load = (async () => ({
	count: appRouter.createCaller(await createContext()).inbox.getCounts()
})) satisfies LayoutServerLoad;
