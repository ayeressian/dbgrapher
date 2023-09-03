<svelte:options customElement='db-viewer'/>

<script lang="ts">
  import type { Schema } from "../../schema";
  import { onMount, setContext } from "svelte";
  import type { Viewport } from "../../store/view";
  import { Store } from "../../store/store";
  import EventDispatcher from "./event-dispatcher";
  import type DbViewer from "./DBViewer";
  import Viewer from "../Viewer/Viewer.svelte";

  const store = new Store();
  setContext("store", store);

  export const getSchema = (): Schema => {
    const copy = JSON.parse(JSON.stringify(store.schema.getSchema()));
    return copy;
  }
  export const setSchema = (schema: Schema, viewport: Viewport) => {
    store.schema.setSchema(schema, viewport);
  };

  let container: HTMLDivElement;
  let eventDispatcher: EventDispatcher;

  onMount(() => {
    const shadowRoot = container.parentNode as ShadowRoot;

    const host = shadowRoot.host as DbViewer;

    eventDispatcher = new EventDispatcher(host);
    store.view.viewSize.set({
      width: host.clientWidth,
      height: host.clientHeight,
    });

    const svgResizeObserver = new ResizeObserver((entries) => {
      store.view.viewSize.set({
        width: host.clientWidth,
        height: host.clientHeight,
      });
    });
    svgResizeObserver.observe(host);
  });
</script>

<style>
  :host {
    display: block;
  }
  #container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  :global(*) {
    font-family: var(--font-family, Arial, sans-serif);
    color: var(--color, #333);
    --table-boarder-color: #a4a2a3;
    --table-color: #a4a2a3;
    --annotation-color: #ffffff;
  }

  :global(svg) {
    background-color: #E3E3E3;
  }
</style>

<div id="container" bind:this={container}>
  <Viewer {eventDispatcher} />
</div>
