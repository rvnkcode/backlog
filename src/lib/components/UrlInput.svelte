<script lang="ts">
	import { onMount } from 'svelte';

	export let value: string;
	export let urls: string[] | null;

	let editMode = false;

	const remove = () => {
		urls = urls?.filter((url) => url !== value) ?? null;
		if (urls?.length === 0) {
			urls = null;
		}
	};

	onMount(() => {
		value.length === 0 ? (editMode = true) : (editMode = false);
	});
</script>

<div class="flex items-center gap-1">
	<ion-icon name="link" class="text-sm" aria-label="link icon" />
	{#if editMode}
		<input
			type="URL"
			required
			placeholder="https://www.example.com"
			class="grow p-1 h-6 mb-1 border-neutral-500 border-b text-sm last:mb-0 placeholder:text-sm focus:outline-1 outline-offset-2 outline-blue-200"
			bind:value
		/>
		<button type="button" on:click={() => (editMode = false)} aria-label="confirm the url input"
			><ion-icon name="checkmark" aria-label="confirm the url input icon" /></button
		>
	{:else}
		<a href={value} target="_blank" class="text-sm text-sky-600 underline">
			{value}
		</a>
		<button type="button" on:click={() => (editMode = true)} aria-label="edit url"
			><ion-icon name="create-outline" aria-label="edit url icon" /></button
		>
	{/if}

	<button type="button" on:click={remove} aria-label="remove url from the list"
		><ion-icon name="remove" aria-label="delete url icon" /></button
	>
</div>
