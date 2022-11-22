export declare enum DialogTypes {
    AboutDialog = "aboutDialog",
    NewOpenDialog = "newOpenDialog",
    CloudProviderChooserDialog = "cloudProviderChooserDialog"
}
declare type DialogsState = {
    [type in DialogTypes]: boolean;
};
declare const slice: import("@reduxjs/toolkit").Slice<DialogsState, {
    close: (state: import("immer/dist/internal").WritableDraft<DialogsState>, { payload: dialogType }: {
        payload: DialogTypes;
    }) => void;
    open: (state: import("immer/dist/internal").WritableDraft<DialogsState>, { payload: dialogType }: {
        payload: DialogTypes;
    }) => void;
}, "dialogs">;
export default slice;
export declare const reducer: import("redux").Reducer<DialogsState, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    close: (state: import("immer/dist/internal").WritableDraft<DialogsState>, { payload: dialogType }: {
        payload: DialogTypes;
    }) => void;
    open: (state: import("immer/dist/internal").WritableDraft<DialogsState>, { payload: dialogType }: {
        payload: DialogTypes;
    }) => void;
}>;
