<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';

	export let note: string | undefined;
	export let urls: string[] | undefined;
</script>

<div class="ml-2">
	{#if note}
		<ion-icon name="document-outline" class="text-sm" use:tooltip tooltipText={note} />
	{/if}

	{#if urls?.length}
		{#each urls as url}
			<a href={url} target="_blank">
				<ion-icon name="link" class="text-sm text-sky-500" use:tooltip tooltipText={url} />
			</a>
		{/each}
	{/if}
</div>
