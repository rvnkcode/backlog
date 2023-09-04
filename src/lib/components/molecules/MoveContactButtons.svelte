<script lang="ts">
  import { onMount } from 'svelte';

  import { invalidateAll } from '$app/navigation';
  import { selectedContacts } from '$lib/stores';
  import { trpc } from '$lib/trpcClient';

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
    class="general"
  >
    <ion-icon name="chevron-forward" role="img" aria-label="Activate contact icon" />
  </button>
  <button
    type="button"
    aria-label="Deactivate contact"
    on:click={async () => await deactivateContacts($selectedContacts)}
    class="general"
  >
    <ion-icon name="chevron-back" role="img" aria-label="Deactivate contact icon" />
  </button>
</div>
