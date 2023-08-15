<script lang="ts">
  export let title: string;
</script>

<input
  type="text"
  name="title"
  placeholder="New To-Do"
  required
  bind:value={title}
  class="grow h-8 border-r-0 rounded-r-none"
/>
