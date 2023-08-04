<script lang="ts">
	export let note: string | null;
</script>

<textarea name="note" placeholder="Notes" bind:value={note} class="w-full mt-1" rows="4" />
