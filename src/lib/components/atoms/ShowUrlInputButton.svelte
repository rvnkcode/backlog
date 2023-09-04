<script lang="ts">
  export let urls: string[] | null | undefined;
</script>

<button
  type="button"
  on:click={() => {
    urls = [...(urls ?? []), '']; // Add new URL input
  }}
  aria-label="show new url input"
>
  <ion-icon name="link-outline" class="text-lg" aria-label="add new link icon" role="img" />
</button>
