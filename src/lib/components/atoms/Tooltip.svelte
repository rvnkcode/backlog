<!-- https://svelte.dev/repl/dd6754a2ad0547c5b1c1ea37c0293fef?version=4.1.2 -->
<script lang="ts">
	export let tooltipText = '';
	export let x: number;
	export let y: number;
</script>

<span style="top: {y - 25}px; left: {x + 5}px;">{tooltipText}</span>

<style>
	span {
		font-size: smaller;
		position: absolute;
		background-color: #f2f3f5;
		color: black;
		padding: 0.3rem;
		border-radius: 0.25rem;
	}
</style>
