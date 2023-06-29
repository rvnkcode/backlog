<script lang="ts">
	import type { RouterOutput } from '$lib/server/router';

	export let tasks: RouterOutput['inbox']['getInbox'];
</script>

{#if tasks.length}
	<ul>
		{#each tasks as t}
			<li>
				<label>
					<input type="checkbox" checked={t.isDone} />
					<a href={`./task/${t.id}`} class="cursor-pointer">
						{t.title}
					</a>
				</label>
			</li>
		{/each}
	</ul>
{:else}
	<span>Your list is empty!</span>
{/if}
