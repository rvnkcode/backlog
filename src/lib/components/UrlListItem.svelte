<script lang="ts">
	import { onMount } from 'svelte';

	export let value: string;
	export let urls: string[] | null;
	export let errors: string[] | undefined = undefined;

	let editMode = false;

	const remove = () => {
		urls = urls?.filter((url) => url !== value) ?? null;
		if (urls?.length === 0) {
			urls = null;
		}
	};

	const confirmUrl = () => {
		if (errors || value === '') {
			return;
		}

		editMode = false;
	};

	onMount(() => {
		value.length === 0 ? (editMode = true) : (editMode = false);

		if (errors) {
			editMode = true;
		}
	});
</script>

<li class="flex items-center gap-1">
	<ion-icon name="link" aria-label="link icon" />
	{#if editMode}
		<input
			type="URL"
			required
			placeholder="https://www.example.com"
			bind:value
			aria-invalid={errors?.length ? 'true' : undefined}
			class="grow h-6"
		/>
		<button type="button" on:click={confirmUrl} aria-label="confirm the url input">
			<ion-icon name="checkmark" class="text-lg" aria-label="confirm the url input icon" /></button
		>
	{:else}
		<!-- TODO: Add link CSS class -->
		<a href={value} target="_blank" class="text-sky-600 underline">
			{value}
		</a>
		<button
			type="button"
			on:click={() => (editMode = true)}
			aria-label="edit url"
			disabled={value === ''}
		>
			<ion-icon name="create-outline" class="text-lg" aria-label="edit url icon" /></button
		>
	{/if}

	<button type="button" on:click={remove} aria-label="remove url from the list">
		<ion-icon name="remove" class="text-lg" aria-label="delete url icon" /></button
	>
</li>
{#if errors}
	<!-- TODO: Add error CSS class -->
	<span class="italic text-red-500 block">{errors}</span>
{/if}
