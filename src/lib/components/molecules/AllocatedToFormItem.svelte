<script lang="ts">
  import AllocatedToInput from '../atoms/AllocatedToInput.svelte';

  export let value: string | null = null;

  let showAllocatedTo = false;

  const handleClick = () => {
    showAllocatedTo = !showAllocatedTo;
    if (!showAllocatedTo) {
      value = null;
    }
  };
</script>

<button type="button" aria-label="show allocated to input" on:click={handleClick}>
  <ion-icon
    name="person-add-outline"
    class="text-lg"
    aria-label="show allocated to input icon"
    role="img"
  />
</button>

{#if showAllocatedTo}
  <AllocatedToInput bind:value />
{/if}
