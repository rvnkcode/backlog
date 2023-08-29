<script lang="ts">
  import Form from '$lib/components/organisms/Form.svelte';
  import List from '$lib/components/organisms/List.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;
  $: ({ form, tasks } = data);
</script>

<svelte:head>
  <title>Backlog: Inbox</title>
</svelte:head>

<header>
  <h2 class="text-lg">
    <ion-icon
      name="file-tray-outline"
      class="text-sm"
      aria-label="Inbox file tray icon"
      role="img"
    />
    <span>Inbox</span>
  </h2>
</header>

<Form data={form} />

<List {tasks} />
