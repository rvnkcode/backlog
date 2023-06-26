<script lang="ts">
	import Form from '$lib/components/Form.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;
	$: ({ form, tasks } = data);
</script>

<header>
	<h2>Inbox</h2>
</header>

<Form data={form} />

{#if tasks}
	<ul>
		{#each tasks as t}
			<li>
				<input type="checkbox" checked={t.isDone} />
				{t.title}
			</li>
		{/each}
	</ul>
{:else}
	<span>Your list is empty!</span>
{/if}
