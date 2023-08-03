<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { trpc } from '$lib/trpcClient';

	export let id: number;

	const deleteTask = async (id: number) => {
		try {
			await trpc.task.delete.mutate(id);
		} catch (error) {
			console.error(error);
		}

		invalidateAll();
	};
</script>

<button
	type="button"
	on:click={async () => await deleteTask(id)}
	aria-label="delete task"
	class="group-hover:visible invisible"
	><ion-icon name="trash-outline" aria-label="trash icon" /></button
>
