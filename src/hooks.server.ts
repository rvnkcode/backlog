import type { Handle } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';
import { trpcApiBase } from '$lib/trpcClient';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith(trpcApiBase)) {
		return await fetchRequestHandler({
			endpoint: trpcApiBase,
			req: event.request,
			router: appRouter,
			createContext
		});
	}

	return await resolve(event);
};
