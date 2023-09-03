<script lang="ts">
  import { getContext } from "svelte";
  import type { Store } from "../../store/store";
  import type Point from "../../point";

  export let name: string;

  const store = getContext<Store>("store");

  const tableSize = store.table.getTableSize(name);
  const tablePos = store.table.getTablePos(name);

  let normlizedTablePos: Point;

  $: {
    if ($tablePos && $tableSize) {
      normlizedTablePos = {
        x: $tablePos.x - $tableSize.width / 2,
        y: $tablePos.y - $tableSize.height / 2,
      };
    }
  }
</script>

<style>
  .minimap-table {
    fill: #BBB;
  }
</style>

<rect class="minimap-table" {...normlizedTablePos} {...$tableSize} />
