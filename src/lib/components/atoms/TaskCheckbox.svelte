<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { trpc } from '$lib/trpcClient';

	export let id: number;
	export let isDone: boolean;
	export let indeterminate: boolean;

	const updateStatus = async (id: number) => {
		try {
			await trpc.task.updateStatus.mutate(id);
		} catch (error) {
			console.error(error);
		}

		invalidateAll();
	};
</script>

<input
	type="checkbox"
	bind:checked={isDone}
	bind:indeterminate
	on:click|preventDefault={async () => await updateStatus(id)}
	class="mr-4"
	id={id.toString()}
/>
