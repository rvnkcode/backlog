<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { TaskSchema } from '$lib/zod';
	import UrlInput from './UrlInput.svelte';

	export let data: SuperValidated<TaskSchema>;
	export let isEdit = false;

	let showMore = false;
	let showUrlInput = false;

	const { form, enhance, allErrors } = superForm(data);
</script>

<form method="post" action={isEdit ? '/?/update_task' : '/?/create_task'} use:enhance>
	{#if isEdit}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<div class="flex">
		<input
			type="text"
			name="title"
			placeholder="New To-Do"
			required
			bind:value={$form.title}
			class="grow p-1"
		/>
		{#if !isEdit}
			<button
				type="button"
				on:click={() => (showMore = !showMore)}
				data-testid="showMoreButton"
				class="px-3"><ion-icon name="ellipsis-vertical" /></button
			>
		{/if}
		<button type="submit" class="px-3 bg-black rounded-r">
			<ion-icon name="add" class="text-white" />
		</button>
	</div>

	{#if showMore || isEdit}
		<textarea
			name="note"
			placeholder="Notes"
			bind:value={$form.note}
			class="w-full mt-1 p-1"
			rows="4"
		/>

		{#if showUrlInput}
			<UrlInput />
		{/if}

		<div class="text-right">
			<button type="button" on:click={() => (showUrlInput = !showUrlInput)}>
				<ion-icon name="link" />
			</button>
		</div>
	{/if}
</form>

<!-- #region Debug -->

<section class="mt-4">
	<SuperDebug data={$form} />
</section>

{#if $allErrors.length}
	<ul>
		{#each $allErrors as error}
			<li><span>{error.path}: {error.messages}</span></li>
		{/each}
	</ul>
{/if}

<!-- #endregion -->
