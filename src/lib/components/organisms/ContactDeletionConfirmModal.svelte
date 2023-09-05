<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Modal from '$lib/components/organisms/Modal.svelte';
  import { trpc } from '$lib/trpcClient';

  export let open: boolean;
  export let id: number;

  const deleteContact = async () => {
    await trpc.contact.removeContact.mutate(id);
    invalidateAll();
    open = false;
  };
</script>

{#if open}
  <div class="backdrop" />
{/if}

<Modal bind:open>
  <header>Remove contact</header>

  <p>
    Are you sure you want to remove the item in the Contact permanently?<br />
    It is also deleted from allocated tasks
  </p>

  <footer>
    <button
      type="button"
      class="general mr-1"
      on:click={() => {
        open = false;
      }}>Cancel</button
    >
    <button type="button" class="general primary" on:click={deleteContact}>OK</button>
  </footer>
</Modal>
