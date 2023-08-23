<script lang="ts">
  export let title: string;
  export let id: number;
  export let isDone: boolean;
</script>

<a href={`./task/${id}`} class={isDone ? "text-neutral-400" : ""}>
  {title}
</a>
