import { PayloadAction } from "@reduxjs/toolkit";
export declare enum LocalizationState {
    ENGLISH = "ENGLISH",
    ARMENIAN = "ARMENIAN"
}
declare const slice: import("@reduxjs/toolkit").Slice<LocalizationState, {
    set: (_: LocalizationState, { payload }: PayloadAction<LocalizationState>) => LocalizationState;
}, "localization">;
export default slice;
export declare const reducer: import("redux").Reducer<LocalizationState, import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    set: (_: LocalizationState, { payload }: PayloadAction<LocalizationState>) => LocalizationState;
}>;
