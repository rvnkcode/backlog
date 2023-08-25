import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter } from './server/router';

export const trpcApiBase = '/api/trpc';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcApiBase
    })
  ],
  transformer: superjson
});
