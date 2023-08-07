<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { type TaskSchema, taskSchema } from '$lib/zod';

	import AllocatedToInput from './atoms/AllocatedToInput.svelte';
	import NoteInput from './atoms/NoteInput.svelte';
	import ShowMoreInputsButton from './atoms/ShowMoreInputsButton.svelte';
	import TaskSubmitButton from './atoms/TaskSubmitButton.svelte';
	import TitleInput from './atoms/TitleInput.svelte';
	import AllocatedToFormItem from './molecules/AllocatedToFormItem.svelte';
	import UrlListItem from './UrlListItem.svelte';

	export let data: SuperValidated<TaskSchema>;
	export let isEdit = false;

	let showMore = false;
	let isSubmitted = false;

	// If want to debug, add "allErrors"
	// const { form, enhance, errors, allErrors } = superForm(data, {
	const { form, enhance, errors } = superForm(data, {
		dataType: 'json',
		customValidity: true,
		validationMethod: 'onblur',
		validators: taskSchema,
		onUpdated({ form }) {
			if (form.message) {
				toast.success(form.message);
				isSubmitted = true;
			}
		}
	});
</script>

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

		{#if isEdit}
			<ion-icon name="person-add-outline" aria-label="allocated to input icon" />
			<AllocatedToInput />
		{/if}

		<!-- URL list -->
		{#if $form.urls?.length}
			<ul class="mt-2">
				{#each $form.urls as url, i}
					<UrlListItem
						bind:value={url}
						bind:urls={$form.urls}
						errors={$errors.urls?.[i]}
						bind:isSubmitted
					/>
				{/each}
			</ul>
		{/if}

		<!-- Some buttons area -->
		<div class="text-right h-6">
			<!--  ↑ Same height as input component e.g. Allocated To input -->

			<!-- Show the new URL input -->
			<button
				type="button"
				on:click={() => {
					$form.urls = [...($form.urls ?? []), '']; // Add new URL input
				}}
				aria-label="show new url input"
			>
				<ion-icon name="link-outline" class="text-lg" aria-label="add new link icon" />
			</button>

			<!-- Allocated to -->
			{#if !isEdit}
				<AllocatedToFormItem bind:value={$form.allocatedTo} />
			{/if}
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
