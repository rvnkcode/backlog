<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { RouterOutput } from '$lib/server/router';
	import { trpc } from '$lib/trpcClient';
	import TaskCheckbox from './atoms/TaskCheckbox.svelte';
	import TaskTitle from './atoms/TaskTitle.svelte';

	export let task: RouterOutput['inbox']['getInbox'][number];

	const deleteTask = async (id: number) => {
		try {
			await trpc.task.delete.mutate(id);
		} catch (error) {
			console.error(error);
		}

		invalidateAll();
	};

	$: indeterminate = task.isStarted && !task.isDone ? true : false;
</script>

<!-- TODO: Change order of elements(checkbox and label) -->
<li class="flex justify-between gap-4 group">
	<label class="flex" for={task.id.toString()}>
		<TaskCheckbox id={task.id} isDone={task.isDone} {indeterminate} />
		<TaskTitle id={task.id} title={task.title} />
		<div class="ml-2">
			<!-- TODO: Display note when hover -->
			{#if task.note}
				<ion-icon name="document-outline" class="text-sm" />
			{/if}

			{#if task.urls?.length}
				{#each task.urls as url}
					<!-- TODO: Display URL when hover -->
					<a href={url} target="_blank">
						<ion-icon name="link" class="text-sm text-sky-500" />
					</a>
				{/each}
			{/if}
		</div>
	</label>

	<button
		type="button"
		on:click={async () => await deleteTask(task.id)}
		data-testid="delete-button"
		class="group-hover:visible invisible"><ion-icon name="trash-outline" /></button
	>
</li>
