<script lang="ts">
  import type { RouterOutput } from '$lib/server/router';

  import SideMenuItem from '../molecules/SideMenuItem.svelte';

  export let count: RouterOutput['list']['getCounts'];
</script>

<nav class="w-full">
  <ul>
    <SideMenuItem label="Inbox" path="/" count={count.inboxCount}>
      <ion-icon name="file-tray-outline" aria-label="inbox menu file tray icon" />
    </SideMenuItem>
    <SideMenuItem label="Waiting for" path="/waiting_for" count={count.waitingForCount}>
      <ion-icon name="chatbox-ellipses-outline" aria-label="waiting for menu icon" />
    </SideMenuItem>
  </ul>
</nav>
