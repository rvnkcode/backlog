import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';

import type { PageServerLoad } from './$types';

export const load = (async () => {
  return appRouter.createCaller(await createContext()).contact.getAllContacts();
}) satisfies PageServerLoad;
