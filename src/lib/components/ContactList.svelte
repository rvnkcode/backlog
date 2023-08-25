<script lang="ts">
  import type { People } from '@prisma/client';
  import EachContact from './molecules/EachContact.svelte';

  export let list: People[];
  export let listTitle: string;
</script>

<!-- TODO: Adjust border color -->
<ul class="border rounded w-full p-1">
  <header class="flex justify-between mb-2 border-b pb-1">
    <label>
      <input type="checkbox" class="form-checkbox mr-1" /><span>Select all</span>
    </label>
    <span>{listTitle}</span>
  </header>

  {#each list as c}
    <EachContact contact={c} />
  {/each}
</ul>
