<script lang="ts">
	import type { RouterOutput } from '$lib/server/router';

	import EachTask from './EachTask.svelte';

	export let tasks: RouterOutput['list']['getInbox'];
</script>

{#if tasks.length}
	<ul class="mt-6">
		{#each tasks as t}
			<EachTask task={t} />
		{/each}
	</ul>
{:else}
	<span>Your list is empty!</span>
{/if}
