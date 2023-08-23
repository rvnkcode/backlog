<script lang="ts">
  import type { RouterOutput } from '$lib/server/router';

  import TaskCheckbox from './atoms/TaskCheckbox.svelte';
  import TaskDeleteButton from './atoms/TaskDeleteButton.svelte';
  import TaskTitle from './atoms/TaskTitle.svelte';
  import TaskInfoIcons from './molecules/TaskInfoIcons.svelte';
  import { page } from '$app/stores'

  export let task: RouterOutput['list']['getInbox'][number];

  $: indeterminate = task.isStarted && !task.isDone ? true : false;
  $: current = $page.url.pathname
</script>

<li class="group flex justify-between">
  <div class="flex items-center">
    <TaskCheckbox id={task.id} isDone={task.isDone} {indeterminate} />
    <label for={task.id.toString()}>
      {#if task.allocatedTo && current === "/waiting_for"}
        <span class="mr-1 text-blue-600">{task.allocatedTo}</span>
      {/if}
      <TaskTitle id={task.id} title={task.title} isDone={task.isDone} />
      <TaskInfoIcons note={task.note} urls={task.urls} />
    </label>
  </div>

  <TaskDeleteButton id={task.id} />
</li>
