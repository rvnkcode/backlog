<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { taskSchema, type TaskSchema } from '$lib/zod';

	import NoteInput from './atoms/NoteInput.svelte';
	import ShowMoreInputsButton from './atoms/ShowMoreInputsButton.svelte';
	import TaskSubmitButton from './atoms/TaskSubmitButton.svelte';
	import TitleInput from './atoms/TitleInput.svelte';
	import UrlListItem from './UrlListItem.svelte';

	export let data: SuperValidated<TaskSchema>;
	export let isEdit = false;

	let showMore = false;

	const { form, enhance, errors, allErrors } = superForm(data, {
		dataType: 'json',
		customValidity: true,
		validationMethod: 'onblur',
		validators: taskSchema
	});
</script>

<!-- TODO: Send toast notification after task updated -->
<form method="post" action={isEdit ? '/?/update_task' : '/?/create_task'} use:enhance>
	<!-- ID input -->
	{#if isEdit}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<!-- Title input area -->
	<div class="flex">
		<TitleInput bind:title={$form.title} />
		{#if !isEdit}
			<ShowMoreInputsButton bind:showMore />
		{/if}
		<TaskSubmitButton {isEdit} />
	</div>

	{#if showMore || isEdit}
		<NoteInput bind:note={$form.note} />

		{#if $form.urls?.length}
			<ul>
				{#each $form.urls as url, i}
					<UrlListItem bind:value={url} bind:urls={$form.urls} errors={$errors.urls?.[i]} />
				{/each}
			</ul>
		{/if}

		<div class="text-right">
			<button
				type="button"
				on:click={() => {
					$form.urls = [...($form.urls ?? []), '']; // Add new URL input
				}}
				aria-label="show new url input"
			>
				<!-- FIXME: Bigger icon -->
				<ion-icon name="link" aria-label="add new link icon" />
			</button>
		</div>
	{/if}
</form>

<!-- #region Debug -->
<!--
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
-->
<!-- #endregion -->
