<script lang="ts">
  import type { People } from '@prisma/client';

  export let contact: People;
</script>

<li>
  <label class="flex justify-between">
    <div>
      <input type="checkbox" class="form-checkbox mr-1" />
      <span>{contact.name}</span>
    </div>
    <div>
      <button type="button">rename</button>
      <button type="button">remove</button>
    </div>
  </label>
</li>
