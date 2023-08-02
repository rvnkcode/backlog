<script lang="ts">
	export let title: string;
</script>

<input
	type="text"
	name="title"
	placeholder="New To-Do"
	required
	bind:value={title}
	class="grow p-1 h-8 border-neutral-500 border border-r-0 rounded-l placeholder:text-sm focus:outline-1 outline-offset-2 outline-blue-200"
/>
