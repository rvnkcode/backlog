<script lang="ts">
	import { page } from '$app/stores';

	export let path: string;
	export let label: string;
	export let count: number | undefined = undefined;

	$: current = $page.url.pathname;
</script>

<li class="hover:bg-neutral-200 py-1 px-2 rounded {current === path ? 'bg-neutral-200' : ''}">
	<a href={path} class="flex items-center justify-between">
		<div>
			<slot />
			<span>{label}</span>
		</div>
		{#if count}
			<span>{count}</span>
		{/if}
	</a>
</li>
