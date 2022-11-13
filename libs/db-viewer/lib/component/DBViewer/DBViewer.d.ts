type DbViewerEventMap = import("./event").DbViewerEventMap;
type Schema = import("../../schema").Schema;
type Viewport = import("../../store/view").Viewport;

export default class DbViewer extends HTMLElement {
  setSchema(schema: Schema, viewport: Viewport): void;
  getSchema(): Schema;

  addEventListener<K extends keyof DbViewerEventMap>(
    type: K,
    listener: (this: DbViewer, ev: DbViewerEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof DbViewerEventMap>(
    type: K,
    listener: (this: HTMLFormElement, ev: DbViewerEventMap[K]) => unknown,
    options?: boolean | EventListenerOptions
  ): void;
}

export * from "../../schema";
export * from "./event";
export { default as Point } from "../../point";
