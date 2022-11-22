import { PayloadAction } from "@reduxjs/toolkit";
import DbGrapherSchema from "../../db-grapher-schema";
import { DbType } from "../../db-grapher-schema";
declare type Data = {
    past: DbGrapherSchema[];
    present: DbGrapherSchema;
    future: DbGrapherSchema[];
};
export declare const MAX_VIEW_WIDTH = 10000;
export declare const MAX_VIEW_HEIGHT = 10000;
export declare const MIN_VIEW_WIDTH = 3000;
export declare const MIN_VIEW_HEIGHT = 3000;
export declare const DEFAULT_VIEW_WIDTH = 5000;
export declare const DEFAULT_VIEW_HEIGHT = 5000;
export declare const VIEW_INCREASE_AMOUNT = 500;
declare const slice: import("@reduxjs/toolkit").Slice<Data, {
    initiate: (_: Data, action: PayloadAction<DbGrapherSchema | undefined>) => Data;
    set: (state: Data, action: PayloadAction<DbGrapherSchema>) => void;
    setDbType: (state: Data, action: PayloadAction<DbType>) => void;
    increaseViewSize: (state: Data) => void;
    decreaseViewSize: (state: Data) => void;
    undo: (state: Data) => void;
    redo: (state: Data) => void;
}, "schema">;
export declare const reducer: import("redux").Reducer<Data, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    initiate: (_: Data, action: PayloadAction<DbGrapherSchema | undefined>) => Data;
    set: (state: Data, action: PayloadAction<DbGrapherSchema>) => void;
    setDbType: (state: Data, action: PayloadAction<DbType>) => void;
    increaseViewSize: (state: Data) => void;
    decreaseViewSize: (state: Data) => void;
    undo: (state: Data) => void;
    redo: (state: Data) => void;
}>;
export default slice;
