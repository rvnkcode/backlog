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

	$: indeterminate = task.isStarted && !task.isDone ? true : false;
</script>

<li>
	<label>
		<input
			type="checkbox"
			bind:checked={task.isDone}
			bind:indeterminate
			on:click|preventDefault={async () => await updateStatus(task.id)}
		/>
		<a href={`./task/${task.id}`} class="cursor-pointer">
			{task.title}
		</a>
	</label>
</li>
