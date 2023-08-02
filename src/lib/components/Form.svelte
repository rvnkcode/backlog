<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { TaskSchema } from '$lib/zod';

	import NoteInput from './atoms/NoteInput.svelte';
	import ShowMoreInputsButton from './atoms/ShowMoreInputsButton.svelte';
	import TaskSubmitButton from './atoms/TaskSubmitButton.svelte';
	import TitleInput from './atoms/TitleInput.svelte';
	import UrlInput from './UrlInput.svelte';

	export let data: SuperValidated<TaskSchema>;
	export let isEdit = false;

	let showMore = false;

	const { form, enhance, allErrors } = superForm(data, { dataType: 'json' });
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

		{#if $form.urls?.length}
			<ul>
				<!-- https://superforms.rocks/concepts/nested-data#arrays-with-primitive-values -->
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
