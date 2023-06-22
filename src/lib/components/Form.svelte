<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { TaskSchema } from '$lib/zod';

	export let data: SuperValidated<TaskSchema>;

	const { form, enhance } = superForm(data);
</script>

<form method="post" action="/?/createTask" use:enhance>
	<input type="text" name="title" placeholder="New To-Do" required bind:value={$form.title} />
	<button type="submit">Add</button>
</form>

<SuperDebug data={$form} />
