import { PayloadAction } from "@reduxjs/toolkit";
export declare enum FileOpenDialogState {
    OpenFromWelcomeDialog = "OpenFromWelcomeDialog",
    OpenFromTopMenu = "OpenFromTopMenu",
    Close = "Close"
}
declare const slice: import("@reduxjs/toolkit").Slice<FileOpenDialogState, {
    close: () => FileOpenDialogState;
    open: (_: FileOpenDialogState, action: PayloadAction<boolean>) => FileOpenDialogState;
}, "fileOpenChooserDialog">;
export default slice;
export declare const reducer: import("redux").Reducer<FileOpenDialogState, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    close: () => FileOpenDialogState;
    open: (_: FileOpenDialogState, action: PayloadAction<boolean>) => FileOpenDialogState;
}>;
