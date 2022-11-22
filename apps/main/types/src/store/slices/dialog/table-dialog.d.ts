import { Point } from "db-viewer";
declare type TableDialogData = {
    open: boolean;
    tableName?: string;
    cords?: Point;
};
declare const slice: import("@reduxjs/toolkit").Slice<TableDialogData, {
    close: () => TableDialogData;
    openCreate: (_: import("immer/dist/internal").WritableDraft<TableDialogData>, { payload: cords }: {
        payload: any;
        type: string;
    }) => TableDialogData;
    openEdit: (_: import("immer/dist/internal").WritableDraft<TableDialogData>, { payload: tableName }: {
        payload: any;
        type: string;
    }) => TableDialogData;
}, "tableDialog">;
export default slice;
export declare const reducer: import("redux").Reducer<TableDialogData, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    close: () => TableDialogData;
    openCreate: (_: import("immer/dist/internal").WritableDraft<TableDialogData>, { payload: cords }: {
        payload: any;
        type: string;
    }) => TableDialogData;
    openEdit: (_: import("immer/dist/internal").WritableDraft<TableDialogData>, { payload: tableName }: {
        payload: any;
        type: string;
    }) => TableDialogData;
}>;
