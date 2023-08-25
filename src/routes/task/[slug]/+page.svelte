<script lang="ts">
  import Form from '$lib/components/Form.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;
  $: ({ task, form } = data);
</script>

<svelte:head>
  <title>Backlog: task/{task.id}</title>
</svelte:head>

<Form data={form} isEdit={true} />

<!-- {@debug task} -->
