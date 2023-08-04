<script lang="ts">
	import '../app.css';

	import { Toaster } from 'svelte-french-toast';
</script>

<header>
	<h1 class="font-semibold text-lg">
		<a href="/">Backlog</a>
	</h1>
</header>

<main>
	<slot />
</main>

<Toaster />
