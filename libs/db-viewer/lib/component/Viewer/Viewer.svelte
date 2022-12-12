<script lang="ts">
  import type { Schema } from "../../schema";
  import { getContext } from "svelte";
  import Table from "../Table/Table.svelte";
  import Relation from "../Relation/Relation.svelte";
  import type { Viewport } from "../../store/view";
  import type Point from "../../point";
  import Minimap from "../Minimap/Minimap.svelte";
  import type { Store } from "../../store/store";
  import ZoomButtons from "../ZoomButtons/ZoomButtons.svelte";
  import Pan from "./pan";
  import type EventDispatcher from "../DBViewer/event-dispatcher";
  import type TableData from "../DBViewer/event";
  import Zoom from "../../zoom";

  export let eventDispatcher: EventDispatcher;

  const store = getContext<Store>("store");

  const schemaStore = store.schema.schema;

  export const getSchema = (): Schema => store.schema.getSchema();
  export const setSchema = (schema: Schema, viewport: Viewport) => {
    store.schema.setSchema(schema, viewport);
  };

  const SCROLL_TO_ZOOM_MULTIPLIER = 0.01;

  let svgElem: SVGSVGElement;

  const zoomStore = store.view.zoom;
  const viewSizeStore = store.view.viewSize;
  const viewPosStore = store.view.viewPos;
  const viewSizeAfterZoomStore = store.view.viewSizeAfterZoom;
  const relationsStore = store.relation.relations;

  function getSvgMousePos(event: MouseEvent) {
    const pt = svgElem.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgPoint = pt.matrixTransform(svgElem?.getScreenCTM()?.inverse());
    return { x: svgPoint.x, y: svgPoint.y };
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
    
    const result = new Zoom(
      zoomAmount,
      mousePos,
      oldZoom,
      $viewSizeStore,
      $viewPosStore
    ).call();

    viewPosStore.set(result.pos);

    zoomStore.set(result.zoom);
    eventDispatcher.onZoom({
      newZoom: result.zoom,
      oldZoom,
      target: getSvgMousePos(event),
    });
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

  let paning = false;

  function onPanStart() {
    paning = true;
  }
  function onPanEnd() {
    paning = false;
  }
  const drag = new Pan(viewPosStore, zoomStore, onPanStart, onPanEnd);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
  class="view"
  bind:this={svgElem}
  on:wheel={mousewheel}
  on:click={click}
  on:mousedown={drag.onMousedown}
  on:mouseup={drag.onMouseup}
  class:pan={paning}
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
<ZoomButtons />
