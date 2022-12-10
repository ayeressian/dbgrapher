<svelte:options tag="db-viewer" />

<script lang="ts">
  import type { Schema } from "../../schema";
  import { onMount, setContext } from "svelte";
  import style from "../../style.css";
  import type { Viewport } from "../../store/view";
  import applyStyle from "../../wc-style-applier";
  import { Store } from "../../store/store";
  import EventDispatcher from "./event-dispatcher";
  import type DbViewer from "./DBViewer";
  import Viewer from "../Viewer/Viewer.svelte";

  const store = new Store();
  setContext("store", store);

  export const getSchema = (): Schema => store.schema.getSchema();
  export const setSchema = (schema: Schema, viewport: Viewport) => {
    store.schema.setSchema(schema, viewport);
  };

  let container: HTMLDivElement;
  let eventDispatcher: EventDispatcher;

  onMount(() => {
    const shadowRoot = container.parentNode as ShadowRoot;
    applyStyle(shadowRoot, style);

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

<div id="container" bind:this={container}>
  <Viewer {eventDispatcher} />
</div>
