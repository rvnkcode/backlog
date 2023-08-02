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
	<ion-icon name="link" class="text-sm" />
	{#if editMode}
		<input
			type="URL"
			placeholder="https://www.example.com"
			class="grow p-1 h-6 mb-1 border-neutral-500 border-b text-sm last:mb-0 placeholder:text-sm focus:outline-1 outline-offset-2 outline-blue-200"
			bind:value
		/>
		<button type="button" on:click={() => (editMode = false)} data-testid="confirm-url-button"
			><ion-icon name="checkmark" /></button
		>
	{:else}
		<a href={value} target="_blank" class="text-sm text-sky-600 underline">
			{value}
		</a>
		<button type="button" on:click={() => (editMode = true)} data-testid="edit-button"
			><ion-icon name="create-outline" /></button
		>
	{/if}

	<button type="button" on:click={remove} data-testid="remove-button"
		><ion-icon name="remove" /></button
	>
</div>
