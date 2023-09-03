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

<style>
  tr {
    border-bottom: 1px solid #bbb;
  }

  td {
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
  }

  td.status {
    height: 20px;
    padding: 0;
    flex-direction: row;
  }

  td.status img {
    width: 14px;
    height: 14px;
    margin-left: 7px;
  }

  .highlight-from {
    background-color: lightgreen;
  }

  .highlight-to {
    background-color: lightcoral;
  }
</style>

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
