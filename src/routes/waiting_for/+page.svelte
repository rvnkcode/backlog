<script lang="ts">
  import Form from '$lib/components/organisms/Form.svelte';
  import List from '$lib/components/organisms/List.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;
  $: ({ form, tasks } = data);
</script>

<svelte:head>
  <title>Backlog: Waiting for</title>
</svelte:head>

<header>
  <h2 class="text-lg">
    <ion-icon
      name="chatbox-ellipses-outline"
      class="text-sm"
      aria-label="Waiting for page title icon"
      role="img"
    />
    <span>Waiting for</span>
  </h2>
</header>

<Form data={form} />

<List {tasks} />
