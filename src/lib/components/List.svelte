<script lang="ts">
	import type { RouterOutput } from '$lib/server/router';
	import EachTask from './EachTask.svelte';

	export let tasks: RouterOutput['inbox']['getInbox'];
</script>

{#if tasks.length}
	<ul>
		{#each tasks as t}
			<EachTask task={t} />
		{/each}
	</ul>
{:else}
	<span>Your list is empty!</span>
{/if}
