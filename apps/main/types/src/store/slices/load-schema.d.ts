export declare enum State {
    LOAD = "LOAD",
    LOAD_VIEWPORT_UNCHANGE = "LOAD_VIEWPORT_UNCHANGE",
    DEFAULT = "DEFAULT"
}
declare const slice: import("@reduxjs/toolkit").Slice<State, {
    load: () => State;
    loadViewportUnchange: () => State;
    loaded: () => State;
}, "setSchema">;
export default slice;
export declare const reducer: import("redux").Reducer<State, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    load: () => State;
    loadViewportUnchange: () => State;
    loaded: () => State;
}>;
