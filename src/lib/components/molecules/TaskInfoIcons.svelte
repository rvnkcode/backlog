<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';

	export let note: string | null;
	export let urls: string[] | undefined;
</script>

<div class="ml-2 inline">
	{#if note}
		<ion-icon
			name="document-outline"
			use:tooltip
			tooltipText={note}
			data-testid="note-icon"
			aria-label="note icon"
		/>
	{/if}

	<!-- TODO: Change color?  -->
	{#if urls?.length}
		{#each urls as url}
			<a href={url} target="_blank" aria-label={url}>
				<ion-icon
					name="link"
					class="text-sky-500"
					use:tooltip
					tooltipText={url}
					aria-label="link icon"
				/>
			</a>
		{/each}
	{/if}
</div>
