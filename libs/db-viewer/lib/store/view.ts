import { derived, get, writable } from "svelte/store";
import type Point from "../point";
import type { RectSize } from "./schema";
import { setViewPosByViewport } from "./set-view-pos-by-viewport";
import type { Store } from "./store";

const SCROLL_BUFFER = 0;

type ViewSize = RectSize;
type ViewPos = Point;
type ViewBound = { left: number; right: number; top: number; bottom: number };
export type Viewport =
  | "noChange"
  | "centerByTablesWeight"
  | "center"
  | "centerByTables";

export class ViewStore {
  viewSize = writable<ViewSize>({ width: 0, height: 0 });
  zoom = writable(1);
  viewPos = writable<ViewPos>({ x: 0, y: 0 });
  viewBound = writable<ViewBound>();
  viewSizeAfterZoom = derived(
    [this.zoom, this.viewSize],
    ([zoomVal, viewSizeVal]) => {
      return {
        width: zoomVal * viewSizeVal.width,
        height: zoomVal * viewSizeVal.height,
      };
    }
  );
  viewBoundSize = derived(this.viewBound, (val) => {
    return {
      width: val.right - val.left,
      height: val.bottom - val.top,
    };
  });
  viewportStore = writable<Viewport>("center");
  viewportApply = writable(false);

  constructor(private store: Store) {
    this.viewSizeAfterZoom.subscribe(this.getUpdateViewBound());
    this.viewPos.subscribe(this.getUpdateViewBound());

    this.store.schema.schema.subscribe(this.applyViewport.bind(this));
    this.viewSizeAfterZoom.subscribe(this.applyViewport.bind(this));
  }

  private getTableStore() {
    return this.store!.table;
  }

  getUpdateViewBound() {
    return this.updateViewBound.bind(this);
  }

  updateViewBound() {
    const viewPosVal = get(this.viewPos);
    const viewSizeAfterZoomVal = get(this.viewSizeAfterZoom);
    const newViewBound = {
      left: viewPosVal.x,
      right: viewPosVal.x + viewSizeAfterZoomVal.width,
      top: viewPosVal.y,
      bottom: viewPosVal.y + viewSizeAfterZoomVal.height,
    };
    for (const [tableName, pos] of this.getTableStore().tablePoses.entries()) {
      const tableSize = get(this.getTableStore().getTableSize(tableName)!);
      const tablePosValue = get(pos);

      const tableWidth = tableSize?.width ?? 0;
      const tableHeight = tableSize?.height ?? 0;

      const right = tablePosValue.x + tableWidth / 2;
      if (right > newViewBound.right) {
        newViewBound.right = right;
      }

      const left = tablePosValue.x - tableWidth / 2;
      if (left < newViewBound.left) {
        newViewBound.left = left;
      }

      const top = tablePosValue.y - tableHeight / 2;
      if (top < newViewBound.top) {
        newViewBound.top = top;
      }

      const bottom = tablePosValue.y + tableHeight / 2;
      if (bottom > newViewBound.bottom) {
        newViewBound.bottom = bottom;
      }
    }

    newViewBound.left -= SCROLL_BUFFER;
    newViewBound.right += SCROLL_BUFFER;
    newViewBound.top -= SCROLL_BUFFER;
    newViewBound.bottom += SCROLL_BUFFER;

    this.viewBound.set(newViewBound);
  }

  applyViewport() {
    const viewportApplyVal = get(this.viewportApply);
    const schema = get(this.store!.schema.schema);
    const viewSizeAfterZoomVal = get(this.viewSizeAfterZoom);

    if (
      get(this.store!.schema.schema).tables.length === 0 ||
      viewSizeAfterZoomVal.width === 0 ||
      viewportApplyVal
    )
      return;

    const tablePoseValues = [...this.store!.table.tablePoses.values()].map(
      (tablePos) => get(tablePos)
    );
    this.viewPos.set(
      setViewPosByViewport({
        viewport: get(this.viewportStore),
        viewSizeAfterZoom: get(this.viewSizeAfterZoom),
        tablePoses: tablePoseValues,
        currentPos: get(this.viewPos),
        viewBoundSize: get(this.viewBoundSize),
      })
    );
    this.viewportApply.set(true);
  }
}
