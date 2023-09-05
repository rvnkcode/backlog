<script lang="ts">
  export let open: boolean;

  const closeModal = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      open = false;
    } else return;
  };
</script>

{#if open}
  <div class="backdrop" />
{/if}

<dialog {open} class="p-4">
  <slot />
</dialog>

<svelte:window on:keydown={closeModal} />
