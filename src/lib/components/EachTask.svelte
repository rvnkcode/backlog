<script lang="ts">
	import type { RouterOutput } from '$lib/server/router';

	import TaskCheckbox from './atoms/TaskCheckbox.svelte';
	import TaskDeleteButton from './atoms/TaskDeleteButton.svelte';
	import TaskInfoIcons from './atoms/TaskInfoIcons.svelte';
	import TaskTitle from './atoms/TaskTitle.svelte';

	export let task: RouterOutput['inbox']['getInbox'][number];

	$: indeterminate = task.isStarted && !task.isDone ? true : false;
</script>

<li class="group flex justify-between">
	<div class="flex">
		<TaskCheckbox id={task.id} isDone={task.isDone} {indeterminate} />
		<label class="flex" for={task.id.toString()}>
			<TaskTitle id={task.id} title={task.title} />
			<TaskInfoIcons note={task.note} urls={task.urls} />
		</label>
	</div>

	<TaskDeleteButton id={task.id} />
</li>
