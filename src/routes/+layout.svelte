<script lang="ts">
  import '../app.css';

  import { Toaster } from 'svelte-french-toast';

  import ExportModal from '$lib/components/organisms/ExportModal.svelte';
  import SideMenu from '$lib/components/organisms/SideMenu.svelte';

  import type { LayoutServerData } from './$types';

  export let data: LayoutServerData;
  $: ({ count } = data);

  let showMenu = false;
  let exportModalOpen = false;
</script>

<header class="px-2 flex justify-between items-center">
  <h1 class="font-semibold text-lg">
    <button on:click={() => (showMenu = !showMenu)} aria-label="Toggle hamburger menu button">
      <!-- TODO: transition -->
      {#if showMenu}
        <ion-icon name="close-outline" aria-label="Close side menu icon" role="img" />
      {:else}
        <ion-icon name="menu-outline" aria-label="Open side menu icon" role="img" />
      {/if}
    </button>

    <a href="/">Backlog</a>
  </h1>

  <div class="flex gap-3">
    <button
      type="button"
      on:click={() => {
        exportModalOpen = true;
      }}
      class="flex items-center"
    >
      <ion-icon name="share" class="mr-1" aria-label="Export icon" role="img" />
      <span class="text-base">Export</span>
    </button>
    <a href="/settings" class="flex items-center">
      <ion-icon name="settings" class="mr-1" aria-label="Settings icon" role="img" />
      <span class="text-base">Settings</span>
    </a>
  </div>
</header>

<section class="flex">
  {#if showMenu}
    <aside class="bg-neutral-50 h-[calc(100vh-2rem)] w-48 p-2">
      <SideMenu {count} />
    </aside>
  {/if}
  <section class="my-0 mx-auto w-full">
    <main>
      <slot />
    </main>
  </section>
</section>

<Toaster />
<ExportModal bind:open={exportModalOpen} />
