<script lang="ts">
  export let isEdit: boolean;
</script>

<button type="submit" aria-label="submit" class="px-2 bg-black rounded-r">
  {#if isEdit}
    <span class="text-white">Update</span>
  {:else}
    <ion-icon name="add" class="text-white text-lg" aria-label="add new task icon" role="img" />
  {/if}
</button>
