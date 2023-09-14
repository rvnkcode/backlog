<script lang="ts">
  import { AutoResizeTextarea } from 'svelte-autoresize-textarea';

  export let note: string | null;
</script>

<AutoResizeTextarea
  bind:value={note}
  minRows={4}
  class="w-full mt-1"
  name="note"
  placeholder="Notes"
/>
