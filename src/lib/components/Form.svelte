<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { TaskSchema } from '$lib/zod';

	export let data: SuperValidated<TaskSchema>;
	export let isEdit = false;

	const { form, enhance, allErrors } = superForm(data);
</script>

<form method="post" action={isEdit ? '/?/update_task' : '/?/create_task'} use:enhance>
	{#if isEdit}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<input type="text" name="title" placeholder="New To-Do" required bind:value={$form.title} />
	<button type="submit">{isEdit ? `Update` : `Add`}</button>
</form>

<SuperDebug data={$form} />

{#if $allErrors.length}
	<ul>
		{#each $allErrors as error}
			<li><span>{error.path}: {error.messages}</span></li>
		{/each}
	</ul>
{/if}
