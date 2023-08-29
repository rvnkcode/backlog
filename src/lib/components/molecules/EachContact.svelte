<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { selectedContacts } from '$lib/stores';
  import { trpc } from '$lib/trpcClient';
  import type { People } from '@prisma/client';
  import ContactDeletionConfirmModal from '../organisms/ContactDeletionConfirmModal.svelte';

  export let contact: People;

  let isEdit = false;
  let open = false; // Open or close modal

  $: checked = $selectedContacts.has(contact.id);

  const handleSelected = (id: number) => {
    $selectedContacts.has(id) ? $selectedContacts.delete(id) : $selectedContacts.add(id);
    invalidateAll();
  };

  const updateName = async (id: number, name: string) => {
    if (name.length < 1) return;
    await trpc.contact.updateName.mutate({ id, name });
    invalidateAll();
    $selectedContacts.clear();
    isEdit = false;
  };
</script>

<li class="flex justify-between itmes-center">
  <label>
    <input
      type="checkbox"
      class="form-checkbox mr-1"
      bind:checked
      on:change={() => {
        handleSelected(contact.id);
      }}
    />
    {#if isEdit}
      <input type="text" placeholder="Enter the new name" bind:value={contact.name} class="h-5" />
    {:else}
      <span>{contact.name}</span>
    {/if}
  </label>

  <!-- Buttons -->
  <div>
    {#if isEdit}
      <button type="button" on:click={async () => await updateName(contact.id, contact.name)}
        >Confirm</button
      >
      <button
        type="button"
        on:click={() => {
          isEdit = false;
        }}>Cancel</button
      >
    {:else}
      <button
        type="button"
        on:click={() => {
          isEdit = true;
        }}>Rename</button
      >
      <button
        type="button"
        on:click={() => {
          open = true;
        }}>Remove</button
      >
    {/if}
  </div>
</li>

<ContactDeletionConfirmModal bind:open id={contact.id} />
