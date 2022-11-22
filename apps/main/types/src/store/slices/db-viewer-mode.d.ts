import { PayloadAction } from "@reduxjs/toolkit";
import DbViewerMode from "./db-viewer-mode-type";
declare const slice: import("@reduxjs/toolkit").Slice<DbViewerMode, {
    none: () => DbViewerMode;
    changeMode: (_: DbViewerMode, { payload }: PayloadAction<DbViewerMode>) => DbViewerMode;
}, "dbViewerMode">;
export default slice;
export declare const reducer: import("redux").Reducer<DbViewerMode, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    none: () => DbViewerMode;
    changeMode: (_: DbViewerMode, { payload }: PayloadAction<DbViewerMode>) => DbViewerMode;
}>;
