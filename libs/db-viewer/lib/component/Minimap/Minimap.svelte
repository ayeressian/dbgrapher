<style>
  .minimap {
    bottom: 60px;
    right: 10px;
    position: absolute;
    background: #EEE;
  }

  .minimap .view-minimap {
    fill: #FFF;
  }
</style>

<script lang="ts">
  import type { Store } from "../../store/store";
  import type { RectSize } from "../../store/schema";
  import MinimapTable from "./Minimap-table.svelte";
  import { getContext } from "svelte";

  let minimapViewSize: RectSize;

  const MAX_SIZE = 200;

  const store = getContext<Store>("store");

  const viewBoundStore = store.view.viewBound;
  const viewSizeAfterZoomStore = store.view.viewSizeAfterZoom;
  const viewPosStore = store.view.viewPos;
  const schemaStore = store.schema.schema;

  $: {
    const viewBondSize = {
      height: $viewBoundStore.bottom - $viewBoundStore.top,
      width: $viewBoundStore.right - $viewBoundStore.left,
    };
    minimapViewSize = {
      width: MAX_SIZE,
      height: MAX_SIZE,
    };
    if (viewBondSize.width > viewBondSize.height && viewBondSize.width !== 0) {
      minimapViewSize.height =
        (MAX_SIZE * viewBondSize.height) / viewBondSize.width;
    } else if (viewBondSize.height !== 0) {
      minimapViewSize.width =
        (MAX_SIZE * viewBondSize.width) / viewBondSize.height;
    }
  }
</script>

<svg
  class="minimap"
  xmlns="http://www.w3.org/2000/svg"
  version="2"
  {...minimapViewSize}
  viewBox={`${$viewBoundStore.left} ${$viewBoundStore.top} ${
    $viewBoundStore.right - $viewBoundStore.left
  } ${$viewBoundStore.bottom - $viewBoundStore.top}`}
>
  <rect class="view-minimap" {...$viewSizeAfterZoomStore} {...$viewPosStore} />
  {#each $schemaStore.tables ?? [] as { name } (name)}
    <MinimapTable {name} />
  {/each}
</svg>
