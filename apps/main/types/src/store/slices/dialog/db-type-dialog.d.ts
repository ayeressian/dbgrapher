import { PayloadAction } from "@reduxjs/toolkit";
export declare enum DbTypeDialogState {
    OpenFromWizard = "OpenFromWizard",
    OpenFromTopMenuNew = "OpenFromTopMenuNew",
    OpenFromTopMenu = "OpenFromTopMenu",
    Close = "Close"
}
export declare type DbTypeDialogOpenState = Exclude<DbTypeDialogState, DbTypeDialogState.Close>;
declare const slice: import("@reduxjs/toolkit").Slice<DbTypeDialogState, {
    close: () => DbTypeDialogState;
    open: (_: DbTypeDialogState, action: PayloadAction<DbTypeDialogOpenState>) => DbTypeDialogState;
}, "dbTypeDialog">;
export default slice;
export declare const reducer: import("redux").Reducer<DbTypeDialogState, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    close: () => DbTypeDialogState;
    open: (_: DbTypeDialogState, action: PayloadAction<DbTypeDialogOpenState>) => DbTypeDialogState;
}>;
