<script context="module" lang="ts">
  export enum Highlight {
    None = 1,
    From,
    To,
  }
</script>

<script lang="ts">
  import type { ColumnFkSchema, ColumnSchema } from "../../schema";
  import { isColumnFk } from "../../schema";
  import pkUrl from "./pk.svg";
  import fkUrl from "./fk.svg";

  export let column: ColumnSchema;
  export let highlight: Highlight;

  export let columnEnter: (column: ColumnFkSchema) => void;
  export let columnLeave: (column: ColumnFkSchema) => void;

  let highlightCssClass = "";
  $: {
    switch (highlight) {
      case Highlight.From:
        highlightCssClass = "highlight-from";
        break;
      case Highlight.To:
        highlightCssClass = "highlight-to";
        break;
      default:
        highlightCssClass = "test";
        break;
    }
  }

  const mouseEnter = () => {
    if (isColumnFk(column)) {
      columnEnter(column);
    }
  };
  const mouseLeave = () => {
    if (isColumnFk(column)) {
      columnLeave(column);
    }
  };
</script>

<!-- <div 
  class="column {highlightCssClass}"
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}>

  <div class="status">
    <img
      style="display: {column.pk ? 'block' : 'none'}"
      alt="primary key"
      src={pkUrl}
    />
  </div>
  <div class="status">
    <img
      style="display: {isColumnFk(column) ? 'block' : 'none'}"
      alt="foreign key"
      src={fkUrl}
    />
  </div>
  <div>{column.name}</div>
  <div>
    {#if !isColumnFk(column)}
      {column.type}
    {/if}
  </div>
</div> -->

<tr
  class={highlightCssClass}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
>
  <td class="status">
    <img
      style="display: {column.pk ? 'block' : 'none'}"
      alt="primary key"
      src={pkUrl}
    />
  </td>
  <td class="status">
    <img
      style="display: {isColumnFk(column) ? 'block' : 'none'}"
      alt="foreign key"
      src={fkUrl}
    />
  </td>
  <td>{column.name}</td>
  <td>
    {#if !isColumnFk(column)}
      {column.type}
    {/if}
  </td>
</tr>
