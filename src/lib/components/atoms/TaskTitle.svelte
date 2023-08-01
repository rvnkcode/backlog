<script lang="ts">
	export let title: string;
	export let id: number;
</script>

<a href={`./task/${id}`}>
	{title}
</a>
