<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import List from '$lib/components/List.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;
	$: ({ form, tasks } = data);
</script>

<svelte:head>
	<title>Backlog: Inbox</title>
</svelte:head>

<header>
	<h2 class="text-lg">
		<ion-icon name="file-tray-outline" class="text-sm" />
		<span>Inbox</span>
	</h2>
</header>

<Form data={form} />

<List {tasks} />
