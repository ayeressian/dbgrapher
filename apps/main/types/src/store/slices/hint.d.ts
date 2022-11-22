import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
export declare enum HintType {
    Save = "Save",
    CreateTable = "CreateTable",
    RelationOneToMany = "RelationOneToMany",
    RelationOneToOne = "RelationOneToOne",
    RelationZeroToMany = "RelationZeroToMany",
    RelationZeroToOne = "RelationZeroToOne",
    RelationCreationFailedFK = "RelationCreationFailedFK",
    Remove = "Remove",
    DriveSave = "DriveSave"
}
export declare type Hint = {
    type: HintType;
    timed: boolean;
};
declare type TimedTypes = HintType.DriveSave | HintType.Save | HintType.RelationCreationFailedFK;
declare const slice: import("@reduxjs/toolkit").Slice<Hint[], {
    hintTimedStart: (state: WritableDraft<Hint>[], { payload }: PayloadAction<TimedTypes>) => void;
    hintTimedEnd: (state: WritableDraft<Hint>[], { payload }: PayloadAction<TimedTypes>) => Hint[];
}, "hint">;
export declare const hintTimed: import("@reduxjs/toolkit").AsyncThunk<void, TimedTypes, {}>;
export default slice;
export declare const reducer: import("redux").Reducer<Hint[], import("redux").AnyAction>, actions: import("@reduxjs/toolkit").CaseReducerActions<{
    hintTimedStart: (state: WritableDraft<Hint>[], { payload }: PayloadAction<TimedTypes>) => void;
    hintTimedEnd: (state: WritableDraft<Hint>[], { payload }: PayloadAction<TimedTypes>) => Hint[];
}>;
