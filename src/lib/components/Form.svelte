<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { TaskSchema } from '$lib/zod';
	import UrlInput from './UrlInput.svelte';

	export let data: SuperValidated<TaskSchema>;
	export let isEdit = false;

	let showMore = false;

	const { form, enhance, allErrors } = superForm(data, { dataType: 'json' });
</script>

<form method="post" action={isEdit ? '/?/update_task' : '/?/create_task'} use:enhance>
	{#if isEdit}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<!-- Title input area -->
	<div class="flex">
		<input
			type="text"
			name="title"
			placeholder="New To-Do"
			required
			bind:value={$form.title}
			class="grow p-1 h-8 border-neutral-500 border border-r-0 rounded-l placeholder:text-sm"
		/>
		{#if !isEdit}
			<button
				type="button"
				on:click={() => (showMore = !showMore)}
				data-testid="show-more-button"
				class="px-2 bg-neutral-200 border-neutral-500 border border-x-0"
				><ion-icon name="ellipsis-vertical" /></button
			>
		{/if}
		<button type="submit" class="px-2 bg-black rounded-r">
			{#if isEdit}
				<span class="text-white">Update</span>
			{:else}
				<ion-icon name="add" class="text-white" />
			{/if}
		</button>
	</div>

	{#if showMore || isEdit}
		<textarea
			name="note"
			placeholder="Notes"
			bind:value={$form.note}
			class="w-full mt-1 p-1 border border-neutral-500 rounded placeholder:text-sm"
			rows="4"
		/>

		{#if $form.urls?.length}
			<ul >
				{#each $form.urls as _, i}
					<li>
						<UrlInput bind:value={$form.urls[i]} bind:urls={$form.urls} />
					</li>
				{/each}
			</ul>
		{/if}

		<div class="text-right">
			<button
				type="button"
				on:click={() => {
					$form.urls = [...($form.urls ?? []), '']; // Add new URL input
				}}
				data-testid="add-new-url"
			>
				<ion-icon name="link" />
			</button>
		</div>
	{/if}
</form>

<!-- #region Debug -->
<!-- <section class="mt-4">
	<SuperDebug data={$form} />
</section>

{#if $allErrors.length}
	<ul>
		{#each $allErrors as error}
			<li><span>{error.path}: {error.messages}</span></li>
		{/each}
	</ul>
{/if} -->
<!-- #endregion -->
