<script lang="ts">
  import ContactList from '$lib/components/ContactList.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  $: ({ activated, disabled } = data);
</script>

<header>
  <h3>Contacts</h3>
</header>

<section class="flex justify-between gap-3">
  <ContactList listTitle="Deactivated" list={disabled} />
  <!-- TODO: Add buttons -->
  <ContactList listTitle="Activated" list={activated} />
</section>
