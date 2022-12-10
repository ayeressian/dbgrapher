<script lang="ts">
  import type { Store } from "lib/store/store";
  import { getContext } from "svelte";
  import Zoom from "../../zoom";

  const store = getContext<Store>("store");
  const viewPosStore = store.view.viewPos;
  const viewSizeStore = store.view.viewSize;
  const zoomStore = store.view.zoom;

  const ZOOM_AMOUNT = 0.2;

  function getViewCenter() {
    return {
      x: $viewSizeStore.width / 2,
      y: $viewSizeStore.height / 2,
    };
  }

  function zoomHandler(amount: number) {
    const target = getViewCenter();

    const result = new Zoom(
      amount,
      target,
      $zoomStore,
      $viewSizeStore,
      $viewPosStore
    ).call();
    zoomStore.set(result.zoom);
    viewPosStore.set(result.pos);
  }

  function zoomIn() {
    zoomHandler(-ZOOM_AMOUNT);
  }

  function zoomOut() {
    zoomHandler(ZOOM_AMOUNT);
  }
</script>

<button on:click={zoomIn} class="zoom-btn in">+</button>
<button on:click={zoomOut} class="zoom-btn out">-</button>
