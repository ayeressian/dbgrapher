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

<style>
  .pure-button:active {
    box-shadow: 0 0 0 1px rgba(0,0,0,.15) inset,0 0 6px rgba(0,0,0,.2) inset;
    border-color: #000;
  }

  .pure-button:focus, .pure-button:hover {
    background-image: linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1));
  }
  .pure-button {
    display: inline-block;
    line-height: normal;
    white-space: nowrap;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    user-select: none;
    box-sizing: border-box;

    font-family: inherit;
    font-size: 100%;
    padding: .5em 1em;
    color: rgba(0,0,0,.8);
    border: none transparent;
    background-color: #e6e6e6;
    text-decoration: none;
    border-radius: 2px;
  }

  .zoom-btn {
    width: 50px;
    height: 40px;
    color: white;
    border-radius: 0;
    background: rgb(197, 197, 197);
  }

  .zoom-btn.in {
    bottom: 10px;
    right:65px;
    position: absolute;
  }

  .zoom-btn.out {
    bottom: 10px;
    right: 10px;
    position: absolute;
  }
</style>

<button on:click={zoomIn} class="zoom-btn in pure-button">+</button>
<button on:click={zoomOut} class="zoom-btn out pure-button">-</button>
