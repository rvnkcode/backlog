<script lang="ts">
  import ExportModal from '$lib/components/organisms/ExportModal.svelte';

  let open = false;
</script>

<button
  type="button"
  on:click={() => {
    open = true;
  }}
  class="flex items-center"
>
  <ion-icon name="share" class="mr-1" aria-label="Export icon" role="img" />
  <span class="text-base">Export</span>
</button>

<ExportModal bind:open />
