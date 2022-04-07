import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { wait } from "../../util";
import { actions as dbViewerModeActions } from "./db-viewer-mode";
import DbViewerMode from "./db-viewer-mode-type";

export enum HintType {
  Save = "Save",
  CreateTable = "CreateTable",
  RelationOneToMany = "RelationOneToMany",
  RelationOneToOne = "RelationOneToOne",
  RelationZeroToMany = "RelationZeroToMany",
  RelationZeroToOne = "RelationZeroToOne",
  RelationCreationFailedFK = "RelationCreationFailedFK",
  Remove = "Remove",
  DriveSave = "DriveSave",
}

export type Hint = {
  type: HintType;
  timed: boolean;
};

type TimedTypes =
  | HintType.DriveSave
  | HintType.Save
  | HintType.RelationCreationFailedFK;

const TIMEOUT = 5000;

const filteredState = (state: WritableDraft<Hint>[]) => {
  return state.filter(
    (hint) =>
      hint.type === HintType.DriveSave ||
      hint.type === HintType.Save ||
      hint.type === HintType.RelationCreationFailedFK
  );
};

const slice = createSlice({
  initialState: [] as Hint[],
  name: "hint",
  reducers: {
    hintTimedStart: (state, { payload }: PayloadAction<TimedTypes>): void => {
      state.push({
        type: payload,
        timed: true,
      });
    },
    hintTimedEnd: (state, { payload }: PayloadAction<TimedTypes>): Hint[] => {
      state = state.filter((hint) => hint.type !== payload);
      return state;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(dbViewerModeActions.changeMode, (state, { payload }) => {
        let type: HintType;
        state = filteredState(state);
        switch (payload) {
          case DbViewerMode.CreateTable:
            type = HintType.CreateTable;
            break;
          case DbViewerMode.RelationOneToMany:
            type = HintType.RelationOneToMany;
            break;
          case DbViewerMode.RelationOneToOne:
            type = HintType.RelationOneToOne;
            break;
          case DbViewerMode.RelationZeroToMany:
            type = HintType.RelationZeroToMany;
            break;
          case DbViewerMode.RelationZeroToOne:
            type = HintType.RelationZeroToOne;
            break;
          case DbViewerMode.Remove:
            type = HintType.Remove;
            break;
          default:
            return;
        }
        state.push({
          type,
          timed: false,
        });
        return state;
      })
      .addCase(dbViewerModeActions.none, (state) => {
        state = filteredState(state);
        return state;
      }),
});

export const hintTimed = createAsyncThunk(
  "hint/hintTimed",
  async (hintType: TimedTypes, { dispatch }): Promise<void> => {
    dispatch(slice.actions.hintTimedStart(hintType));
    await wait(TIMEOUT);
    dispatch(slice.actions.hintTimedEnd(hintType));
  }
);

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
