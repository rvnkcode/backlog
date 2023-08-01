<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { RouterOutput } from '$lib/server/router';
	import { trpc } from '$lib/trpcClient';

	export let task: RouterOutput['inbox']['getInbox'][number];

	const updateStatus = async (id: number) => {
		try {
			await trpc.task.updateStatus.mutate(id);
		} catch (error) {
			console.error(error);
		}

		invalidateAll();
	};

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

<li class="flex justify-between gap-4 group">
	<label class="flex">
		<input
			type="checkbox"
			bind:checked={task.isDone}
			bind:indeterminate
			on:click|preventDefault={async () => await updateStatus(task.id)}
			class="mr-4"
		/>
		<a href={`./task/${task.id}`}>
			{task.title}
		</a>
		{#if task.urls?.length}
			<div class="ml-2">
				{#each task.urls as url}
					<a href={url} target="_blank">
						<ion-icon name="link" class="text-sm text-sky-500" />
					</a>
				{/each}
			</div>
		{/if}
	</label>
	<button
		type="button"
		on:click={async () => await deleteTask(task.id)}
		data-testid="delete-button"
		class="group-hover:visible invisible"><ion-icon name="trash-outline" /></button
	>
</li>
