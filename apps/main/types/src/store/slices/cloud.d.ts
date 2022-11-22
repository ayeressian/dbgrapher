import { PayloadAction } from "@reduxjs/toolkit";
export declare enum CloudProvider {
    Local = "Local",
    GoogleDrive = "GoogleDrive",
    OneDrive = "OneDrive",
    NotSelected = "NotSelected"
}
export declare enum CloudUpdateState {
    Saved = "Saved",
    Saving = "Saving",
    None = "None",
    NetworkError = "NetworkError"
}
export declare type CloudUserData = {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    picture: string;
};
export declare type CloudState = {
    provider: CloudProvider;
    userData?: CloudUserData;
    fileName?: string;
    updateState: CloudUpdateState;
};
declare const slice: import("@reduxjs/toolkit").Slice<CloudState, {
    setUserData: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<CloudUserData>) => CloudState;
    setDriveType: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<CloudProvider>) => CloudState;
    setFileName: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<string>) => CloudState;
    setUpdateState: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<CloudUpdateState>) => CloudState;
}, "cloud">;
export default slice;
export declare const reducer: import("redux").Reducer<CloudState, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    setUserData: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<CloudUserData>) => CloudState;
    setDriveType: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<CloudProvider>) => CloudState;
    setFileName: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<string>) => CloudState;
    setUpdateState: (state: import("immer/dist/internal").WritableDraft<CloudState>, { payload }: PayloadAction<CloudUpdateState>) => CloudState;
}>;
