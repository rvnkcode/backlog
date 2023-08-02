<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import type { RouterOutput } from '$lib/server/router';
	import TaskCheckbox from './atoms/TaskCheckbox.svelte';
	import TaskDeleteButton from './atoms/TaskDeleteButton.svelte';
	import TaskTitle from './atoms/TaskTitle.svelte';

	export let task: RouterOutput['inbox']['getInbox'][number];

	$: indeterminate = task.isStarted && !task.isDone ? true : false;
</script>

<li class="group flex justify-between">
	<div class="flex">
		<TaskCheckbox id={task.id} isDone={task.isDone} {indeterminate} />
		<label class="flex" for={task.id.toString()}>
			<TaskTitle id={task.id} title={task.title} />
			<div class="ml-2">
				{#if task.note}
					<ion-icon name="document-outline" class="text-sm" use:tooltip tooltipText={task.note} />
				{/if}

				{#if task.urls?.length}
					{#each task.urls as url}
						<a href={url} target="_blank">
							<ion-icon name="link" class="text-sm text-sky-500" use:tooltip tooltipText={url} />
						</a>
					{/each}
				{/if}
			</div>
		</label>
	</div>

	<TaskDeleteButton id={task.id} />
</li>
