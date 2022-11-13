<svelte:options tag="db-viewer" />

<script lang="ts">
  import type { Schema } from "../../schema";
  import { onMount, setContext } from "svelte";
  import Table from "../Table/Table.svelte";
  import Relation from "../Relation/Relation.svelte";
  import style from "../../style.css";
  import type { Viewport } from "../../store/view";
  import applyStyle from "../../wc-style-applier";
  import type Point from "../../point";
  import Minimap from "../Minimap/Minimap.svelte";
  import { Store } from "../../store/store";
  import type { TableData } from "./event";
  import EventDispatcher from "./event-dispatcher";
  import type DbViewer from "./DBViewer";

  const store = new Store();
  setContext("store", store);

  const schemaStore = store.schema.schema;

  export const getSchema = (): Schema => store.schema.getSchema();
  export const setSchema = (schema: Schema, viewport: Viewport) => {
    store.schema.setSchema(schema, viewport);
  }

  const SCROLL_TO_ZOOM_MULTIPLIER = 0.01;
  const MAXIMUM_ZOOM = 0.4;
  const MINIMUM_ZOOM = 4;
  const DEFAULT_ZOOM = 1;

  let container: HTMLDivElement;
  let svgElem: SVGSVGElement;

  const zoomStore = store.view.zoom;
  const viewSizeStore = store.view.viewSize;
  const viewPosStore = store.view.viewPos;
  const viewSizeAfterZoomStore = store.view.viewSizeAfterZoom;
  const relationsStore = store.relation.relations;

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
    zoomStore.set(DEFAULT_ZOOM);
  });

  function getSvgMousePos(event: MouseEvent) {
    const pt = svgElem.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const domPoint = pt.matrixTransform(svgElem?.getScreenCTM()?.inverse());
    return { x: domPoint.x, y: domPoint.y };
  }

  function zoomHandler(event: WheelEvent) {
    event.preventDefault();

    const bb = svgElem.getBoundingClientRect();
    const mousePos: Point = {
      x: event.clientX - bb.left,
      y: event.clientY - bb.top,
    };
    const zoomAmount = event.deltaY * SCROLL_TO_ZOOM_MULTIPLIER;
    const oldZoom = $zoomStore;
    let newZoom = $zoomStore + zoomAmount;
    newZoom = Math.max(newZoom, MAXIMUM_ZOOM);
    newZoom = Math.min(newZoom, MINIMUM_ZOOM);

    if (newZoom === oldZoom) {
      return;
    }

    const newWidth = $viewSizeStore.width * newZoom;
    const oldWidth = $viewSizeStore.width * oldZoom;

    const newHeight = $viewSizeStore.height * newZoom;
    const oldHeight = $viewSizeStore.height * oldZoom;

    const widthDelta = oldWidth - newWidth;
    const heightDelta = oldHeight - newHeight;

    viewPosStore.update((viewPosVal) => {
      viewPosVal.x =
        viewPosVal.x + (widthDelta * mousePos.x) / $viewSizeStore.width;
      viewPosVal.y =
        viewPosVal.y + (heightDelta * mousePos.y) / $viewSizeStore.height;
      return viewPosVal;
    });
    zoomStore.set(newZoom);
    eventDispatcher.onZoom({ newZoom, oldZoom, target: getSvgMousePos(event) });
  }

  function scrollOperation(scrollXAmount: number, scrollYAmount: number) {
    viewPosStore.update((viewPosVal) => {
      viewPosVal.x += scrollXAmount;
      viewPosVal.y += scrollYAmount;
      return viewPosVal;
    });
  }

  function scrollHandler(event: WheelEvent) {
    event.preventDefault();
    scrollOperation(event.deltaX, event.deltaY);
  }

  function mousewheel(event: WheelEvent) {
    if (event.ctrlKey) {
      zoomHandler(event);
      return;
    }
    scrollHandler(event);
  }

  function onTableMouseDown({ name }: TableData) {
    const index = $schemaStore.tables.findIndex((table) => table.name === name);
    const [table] = $schemaStore.tables.splice(index, 1);
    $schemaStore.tables = [...$schemaStore.tables, table];
  }

  function click(event: MouseEvent) {
    eventDispatcher.onViewportClick(getSvgMousePos(event));
  }
</script>

<div id="container" bind:this={container}>
  <svg
    class="view"
    bind:this={svgElem}
    on:wheel={mousewheel}
    on:click={click}
    version="2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`${$viewPosStore.x} ${$viewPosStore.y} ${$viewSizeAfterZoomStore.width} ${$viewSizeAfterZoomStore.height}`}
  >
    {#each $relationsStore ?? [] as relation (relation.key)}
      <Relation
        {...relation}
        click={eventDispatcher.onRelationClick}
        dblClick={eventDispatcher.onRelationDblClick}
        contextMenu={eventDispatcher.onRelationContextMenu}
      />
    {/each}   
    {#each $schemaStore?.tables ?? [] as { name } (name)}
      <Table
        {name}
        mouseDown={onTableMouseDown}
        click={eventDispatcher.onTableClick}
        dblClick={eventDispatcher.onTableDblClick}
        contextMenu={eventDispatcher.onTableContextMenu}
      />
    {/each}     
  </svg>
  <Minimap />
</div>
