<script lang="ts">
	import { onMount } from 'svelte';

	import type { RouterOutput } from '$lib/server/router';
	import { trpc } from '$lib/trpcClient';

	export let value: string | null = null;

	let list: RouterOutput['contact']['getContacts'] = [];

	onMount(async () => {
		list = await trpc.contact.getContacts.query();
	});
</script>

<input
	bind:value
	placeholder="Allocated to..."
	list="names"
	autocomplete="off"
	name="allocatedTo"
	class="h-6 align-middle"
/>

<datalist id="names">
	{#each list as name}
		<option value={name} />
	{/each}
</datalist>
