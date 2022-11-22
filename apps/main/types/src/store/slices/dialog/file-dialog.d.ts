export declare enum FileDialogState {
    OpenDialog = "OpenDialog",
    SaveDialog = "SaveDialog",
    SaveAsDialog = "SaveAsDialog",
    OpenSqlDialog = "OpenSqlDialog",
    None = "None"
}
declare const slice: import("@reduxjs/toolkit").Slice<FileDialogState, {
    close: () => FileDialogState;
    open: (_: FileDialogState, { payload: fileDialogState }: {
        payload: any;
        type: string;
    }) => FileDialogState;
}, "fileDialog">;
export default slice;
export declare const reducer: import("redux").Reducer<FileDialogState, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    close: () => FileDialogState;
    open: (_: FileDialogState, { payload: fileDialogState }: {
        payload: any;
        type: string;
    }) => FileDialogState;
}>;
