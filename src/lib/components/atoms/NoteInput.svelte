<script lang="ts">
	export let note: string | null;
</script>

<textarea
	name="note"
	placeholder="Notes"
	bind:value={note}
	class="w-full mt-1 p-1 border border-neutral-500 rounded placeholder:text-sm focus:outline-1 outline-offset-2 outline-blue-200"
	rows="4"
/>
