<script lang="ts">
  import type { Store } from "lib/store/store";
  import { getContext } from "svelte";

  export let maxZoom: number;
  export let minZoom: number;

  const store = getContext<Store>("store");
  const viewPosStore = store.view.viewPos;
  const viewSizeStore = store.view.viewSize;
  const zoomStore = store.view.zoom;

  const ZOOM_AMOUNT = 0.2;

  function scrollAfterZoom(deltaZoom: number) {
    viewPosStore.update((viewPosVal) => {
      viewPosVal.x += $viewSizeStore.width * deltaZoom / 2;
      viewPosVal.y += $viewSizeStore.height * deltaZoom / 2;
      return viewPosVal;
    });
  }

  function zoomIn() {
    const oldZoom = $zoomStore;
    let newZoom = oldZoom - ZOOM_AMOUNT;
    newZoom = Math.max(newZoom, maxZoom);
    zoomStore.set(newZoom);
    scrollAfterZoom(oldZoom - newZoom);
  }
  function zoomOut() {
    const oldZoom = $zoomStore;
    let newZoom = oldZoom + ZOOM_AMOUNT;
    newZoom = Math.min(newZoom, minZoom);
    zoomStore.set(newZoom);
    scrollAfterZoom(oldZoom - newZoom);
  }

</script>

<button on:click={zoomIn} class="zoom-btn in">+</button>
<button on:click={zoomOut} class="zoom-btn out">-</button>