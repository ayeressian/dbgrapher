declare const slice: import("@reduxjs/toolkit").Slice<boolean, {
    start: () => boolean;
    stop: () => boolean;
}, "loadScreen">;
export default slice;
export declare const reducer: import("redux").Reducer<boolean, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    start: () => boolean;
    stop: () => boolean;
}>;
