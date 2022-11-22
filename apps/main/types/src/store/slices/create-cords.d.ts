import { PayloadAction } from "@reduxjs/toolkit";
import { Point } from "db-viewer";
declare type IPointNullable = Point | null;
declare const slice: import("@reduxjs/toolkit").Slice<Point | null, {
    setCord: (_: import("immer/dist/internal").WritableDraft<Point> | null, action: PayloadAction<IPointNullable>) => IPointNullable;
}, "createCord">;
export default slice;
export declare const reducer: import("redux").Reducer<Point | null, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    setCord: (_: import("immer/dist/internal").WritableDraft<Point> | null, action: PayloadAction<IPointNullable>) => IPointNullable;
}>;
