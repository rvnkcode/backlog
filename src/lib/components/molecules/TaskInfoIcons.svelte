<script lang="ts">
  import { tooltip } from '$lib/actions/tooltip';

  export let note: string | null;
  export let urls: string[] | undefined;
</script>

<div class="ml-2 inline">
  {#if note}
    <ion-icon
      name="document-outline"
      use:tooltip
      tooltipText={note}
      aria-label="note icon"
      role="img"
    />
  {/if}

  {#if urls?.length}
    {#each urls as url}
      <a href={url} target="_blank" aria-label={url}>
        <ion-icon
          name="link-outline"
          class="text-indigo-700"
          use:tooltip
          tooltipText={url}
          aria-label="link icon"
          role="img"
        />
      </a>
    {/each}
  {/if}
</div>
