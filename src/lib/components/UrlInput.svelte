<script lang="ts">
	export let value: string;
	export let urls: string[] | null;

	const remove = () => {
		urls = urls?.filter((url) => url !== value) ?? null;
		if (urls?.length === 0) {
			urls = null;
		}
	};
</script>

<div class="flex items-center gap-1">
	<ion-icon name="link" />
	<input type="URL" placeholder="https://www.example.com" class="grow p-1" bind:value />
	<button type="button" on:click={remove}><ion-icon name="remove" /></button>
</div>
