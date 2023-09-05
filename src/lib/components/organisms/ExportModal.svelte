<script lang="ts">
  import Papa from 'papaparse';
  import toast from 'svelte-french-toast';

  import Modal from '$lib/components/organisms/Modal.svelte';
  import { trpc } from '$lib/trpcClient';

  export let open: boolean;

  const fileTypes = ['json', 'csv'];
  let selectedType = fileTypes[0];
  let isIncludedTrashed = true;
  let isIncludedCompleted = true;

  const handleClick = async () => {
    const data = await trpc.list.getAllTasks.query({ isIncludedTrashed, isIncludedCompleted });
    if (data.length < 1) {
      toast.error('There is no data to backup');
      open = false;
      return;
    }

    const a = document.createElement('a');

    switch (selectedType) {
      case 'json':
        a.href = URL.createObjectURL(
          new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        );
        break;
      case 'csv':
        a.href = URL.createObjectURL(new Blob([Papa.unparse(data)], { type: 'text/csv' }));
        break;
    }

    a.setAttribute('download', `backlog.${selectedType}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
</script>

<Modal bind:open>
  <header>Export data</header>

  <filedset>
    <legend>Select export file type</legend>

    {#each fileTypes as type}
      <label>
        <input
          type="radio"
          name="fileType"
          class="form-radio"
          value={type}
          bind:group={selectedType}
        />
        <span>{type.toLocaleUpperCase()}</span>
      </label>
    {/each}
  </filedset>

  <filedset>
    <legend class="mt-2">Options</legend>
    <label
      ><input type="checkbox" class="form-checkbox mr-1" bind:checked={isIncludedTrashed} /><span
        >Include trashed items</span
      ></label
    >
    <label
      ><input type="checkbox" class="form-checkbox mr-1" bind:checked={isIncludedCompleted} /><span
        >Include completed items</span
      ></label
    >
  </filedset>

  <footer>
    <button
      type="button"
      class="general mr-1"
      on:click={() => {
        open = false;
      }}>Cancel</button
    >
    <button type="button" class="general primary" on:click={handleClick}>Export</button>
  </footer>
</Modal>
