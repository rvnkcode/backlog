<script lang="ts">
  import type { People } from '@prisma/client';
  import { onMount } from 'svelte';

  import { invalidateAll } from '$app/navigation';
  import { selectedContacts } from '$lib/stores';

  import EachContact from '../molecules/EachContact.svelte';

  export let list: People[];
  export let listTitle: string;

  let checked = false; // Select all checked

  $: if (list.length === 0) {
    checked = false;
  }

  const handleSelectAll = () => {
    if (checked && list.length > 0) {
      list.forEach((c: People) => $selectedContacts.add(c.id));
    } else {
      $selectedContacts.clear();
    }

    invalidateAll();
  };

  onMount(() => {
    $selectedContacts.clear();
  });
</script>

<!-- TODO: Adjust border color? -->
<div class="border rounded w-full p-1">
  <header class="flex justify-between mb-2 border-b pb-1">
    <label>
      <input
        type="checkbox"
        class="form-checkbox mr-1"
        bind:checked
        on:change={handleSelectAll}
      /><span>Select all</span>
    </label>
    <span>{listTitle}</span>
  </header>

  <ul>
    {#each list as c}
      <EachContact contact={c} />
    {/each}
  </ul>
</div>
