<script lang="ts">
	import type { RouterOutput } from '$lib/server/router';

	import SideMenuItem from './molecules/SideMenuItem.svelte';

	export let count: RouterOutput['inbox']['getCounts'];
</script>

<nav class="w-full">
	<ul>
		<SideMenuItem label="Inbox" path="/" count={count.inboxCount}>
			<ion-icon name="file-tray-outline" />
		</SideMenuItem>
		<SideMenuItem label="Waiting for" path="/waiting_for">
			<ion-icon name="chatbox-ellipses-outline" />
		</SideMenuItem>
	</ul>
</nav>
