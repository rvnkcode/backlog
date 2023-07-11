<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { TaskSchema } from '$lib/zod';

	export let data: SuperValidated<TaskSchema>;
	export let isEdit = false;

	let showMore = false;

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
			class="grow p-1 focus:bg-gray-100 focus:outline-none"
		/>
		{#if !isEdit}
			<button
				type="button"
				on:click={() => (showMore = !showMore)}
				data-testid="showMoreButton"
				class="px-3"><ion-icon name="ellipsis-vertical" /></button
			>
		{/if}
		<button type="submit" class="px-3 bg-black">
			<ion-icon name="add" class="text-white" />
		</button>
	</div>
	{#if showMore || isEdit}
		<textarea
			name="note"
			placeholder="Notes"
			bind:value={$form.note}
			class="w-full p-1 mt-1 focus:bg-gray-100 focus:outline-none"
			rows="4"
		/>
	{/if}
</form>

<!-- #region Debug -->

<!-- <SuperDebug data={$form} /> -->

{#if $allErrors.length}
	<ul>
		{#each $allErrors as error}
			<li><span>{error.path}: {error.messages}</span></li>
		{/each}
	</ul>
{/if}

<!-- #endregion -->
