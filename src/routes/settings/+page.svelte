<script lang="ts">
  import MoveContactButtons from '$lib/components/molecules/MoveContactButtons.svelte';
  import ContactList from '$lib/components/organisms/ContactList.svelte';

  import type { PageServerData } from './$types';

  export let data: PageServerData;

  $: ({ activated, disabled } = data);
</script>

<svelte:head>
  <title>Backlog: Settings</title>
</svelte:head>

<header>
  <h2 class="text-lg">
    <ion-icon name="settings-outline" class="text-sm" role="img" aria-label="Settings icon" />
    <span>Settings</span>
  </h2>
  <!-- TODO: Making tab? -->
  <h3 class="my-3">Contacts</h3>
</header>

<section class="flex justify-between gap-3">
  <ContactList listTitle="Deactivated" list={disabled} />
  <MoveContactButtons />
  <ContactList listTitle="Activated" list={activated} />
</section>
