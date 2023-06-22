<script lang="ts">
	import Form from '$lib/components/Form.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;
	$: ({ form } = data);
</script>

<header>
	<h2>Inbox</h2>
</header>

<Form data={form} />
