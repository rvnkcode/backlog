<script lang="ts">
	import { onMount } from 'svelte';

	export let value: string;
	export let urls: string[] | null;
	export let errors: string[] | undefined = undefined;
	export let isSubmitted = false;

	let urlEditMode = false;

	$: if (isSubmitted) {
		urlEditMode = false;
		isSubmitted = false; // If you don't turn back the status here, it will reflect only the first time and not after that.
	}

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

		urlEditMode = false;
	};

	onMount(() => {
		value.length === 0 ? (urlEditMode = true) : (urlEditMode = false);

		if (errors) {
			urlEditMode = true;
		}
	});
</script>

<li class="flex items-center gap-1">
	<ion-icon name="link-outline" aria-label="link icon" />
	{#if urlEditMode}
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
		<a href={value} target="_blank" class="link">
			{value}
		</a>
		<button
			type="button"
			on:click={() => (urlEditMode = true)}
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
	<span class="error">{errors}</span>
{/if}
