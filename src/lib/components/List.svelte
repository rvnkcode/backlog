<script lang="ts">
	import type { RouterOutput } from '$lib/server/router';

	export let tasks: RouterOutput['inbox']['getInbox'];
</script>

{#if tasks.length > 0}
	<ul>
		{#each tasks as t}
			<li>
				<label>
					<input type="checkbox" checked={t.isDone} />
					<span>
						{t.title}
					</span>
				</label>
			</li>
		{/each}
	</ul>
{:else}
	<span>Your list is empty!</span>
{/if}
