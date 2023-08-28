<!-- TODO: Close modal when press ESC key -->
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
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

<dialog {open}>
  <header>Remove contact</header>

  <p>
    Are you sure you want to remove the item in the Contact permanently?<br />
    It is also deleted from allocated tasks
  </p>

  <footer class="text-right">
    <button
      type="button"
      on:click={() => {
        open = false;
      }}>Cancel</button
    >
    <button type="button" on:click={deleteContact}>OK</button>
  </footer>
</dialog>
