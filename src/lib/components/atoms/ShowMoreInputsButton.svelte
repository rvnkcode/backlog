<script lang="ts">
	export let showMore: boolean;
</script>

<button
	type="button"
	on:click={() => (showMore = !showMore)}
	data-testid="show-more-button"
	class="px-2 bg-neutral-200 border-neutral-500 border border-x-0"
	><ion-icon name="ellipsis-vertical" /></button
>
