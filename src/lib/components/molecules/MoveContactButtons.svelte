<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { selectedContacts } from '$lib/stores';
  import { trpc } from '$lib/trpcClient';
  import { onMount } from 'svelte';

  const deactivateContacts = async (ids: Set<number>) => {
    if (ids.size < 1) return; // Do nothing

    await trpc.contact.deactivateSelectedContacts.mutate(Array.from(ids));
    $selectedContacts.clear();
    invalidateAll();
  };

  const activateContacts = async (ids: Set<number>) => {
    if (ids.size < 1) return; // Do nothing

    await trpc.contact.activateSelectedContacts.mutate(Array.from(ids));
    $selectedContacts.clear();
    invalidateAll();
  };

  onMount(() => {
    $selectedContacts.clear();
  });
</script>

<div class="flex flex-col justify-center gap-2">
  <button
    type="button"
    aria-label="Activate contact"
    on:click={async () => await activateContacts($selectedContacts)}
  >
    <ion-icon name="chevron-forward" />
  </button>
  <button
    type="button"
    aria-label="Deactivate contact"
    on:click={async () => await deactivateContacts($selectedContacts)}
  >
    <ion-icon name="chevron-back" />
  </button>
</div>

<style>
  button {
    border-radius: 0.25rem;
    padding: 0.25rem;
    border: solid 1px #737373;
  }
</style>
