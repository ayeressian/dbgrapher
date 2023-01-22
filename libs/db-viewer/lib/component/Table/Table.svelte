<script lang="ts">
  import type Point from "../../point";

  import Column, { Highlight } from "../Column/Column.svelte";
  import { getContext, onMount, tick } from "svelte";
  import type { ColumnFkSchema } from "../../schema";
  import type { Store } from "../../store/store";
  import type TableData from "../DBViewer/event";

  export let name: string;

  type EventCallback = (tableData: TableData) => void;

  export let mouseDown: EventCallback = () => {};
  export let click: EventCallback;
  export let dblClick: EventCallback;
  export let contextMenu: EventCallback;
  export let tableMoveEnd: EventCallback;
  export let mouseEnter: EventCallback;

  const store = getContext<Store>("store");
  const schemaStore = store.schema.schema;
  const zoomStore = store.view.zoom;

  let width = 0;
  let height = 0;

  let tableElem: HTMLTableElement;

  const table = $schemaStore.tables.find((table) => table.name === name);
  const tableSize = store.table.getTableSize(name)!;
  const tablePos = store.table.getTablePos(name)!;

  let initMouseDown: Point;
  let initPos: Point;

  let moveInProgress = false;

  const getTableData = () => ({ name, pos: $tablePos, size: $tableSize });

  onMount(async () => {
    const ro = new ResizeObserver(([entry]) => {
      const {inlineSize, blockSize} = entry.borderBoxSize[0];
      width = inlineSize;
      height = blockSize;
      tableSize.set({
        width,
        height,
      });
    });
    ro.observe(tableElem);
  });

  function mouseUp(): void {
    document.removeEventListener("mousemove", onMouseMove);
    if (moveInProgress) tableMoveEnd(getTableData());    
    moveInProgress = false;
  }

  function mouseDownInternal(event: MouseEvent): void {
    initMouseDown = {
      x: event.clientX * $zoomStore,
      y: event.clientY * $zoomStore,
    };

    initPos = $tablePos;

    mouseDown(getTableData());
    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", mouseUp);
  }

  function mouseEnterInternal() {
    mouseEnter(getTableData());
  }

  function onMouseMove(event: MouseEvent): void {
    moveInProgress = true;
    tablePos.set({
      x: initPos.x + event.clientX * $zoomStore - initMouseDown.x,
      y: initPos.y + event.clientY * $zoomStore - initMouseDown.y,
    });
  }

  const toHighlight = store.table.getTableToHighlight(name);
  const fromHighlight = store.table.getTableFromHighlight(name);

  const columnEnter = (column: ColumnFkSchema) => {
    store.table.setTableFromHighlight(table?.name ?? "", column.name);
    store.table.setTableToHighlight(column.fk.table, column.fk.column);
  };
  const columnLeave = (column: ColumnFkSchema) => {
    store.table.setTableFromHighlight(table?.name ?? "", "");
    store.table.setTableToHighlight(column.fk.table, "");
  };

  const dblClickInternal = () => dblClick(getTableData());
  const clickInternal = () => click(getTableData());
  const contextMenuInternal = () => contextMenu(getTableData());
</script>

<g>
  <foreignObject
    x={$tablePos ? $tablePos.x - width / 2 : 0}
    y={$tablePos ? $tablePos.y - height / 2 : 0}
    {width}
    {height}
    data-testid="table-{name}"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <table
      bind:this={tableElem}
      on:mousedown={mouseDownInternal}
      on:dblclick={dblClickInternal}
      on:click={clickInternal}
      on:contextmenu={contextMenuInternal}
      on:mouseenter={mouseEnterInternal}
      class:move={moveInProgress}
    >
      <thead>
        <tr><th colspan="4">{name}</th></tr>
      </thead>
      <tbody>
        {#each table?.columns ?? [] as column}
          <Column
            {column}
            {columnEnter}
            {columnLeave}
            highlight={$toHighlight === column.name
              ? Highlight.To
              : $fromHighlight === column.name
              ? Highlight.From
              : Highlight.None}
          />
        {/each}
      </tbody>
    </table>
  </foreignObject>
</g>
