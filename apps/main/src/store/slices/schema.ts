import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DbGrapherSchema from "../../db-grapher-schema";
import { DbType } from "../../db-grapher-schema";

type Data = {
  past: DbGrapherSchema[];
  present: DbGrapherSchema;
  future: DbGrapherSchema[];
};

export const MAX_VIEW_WIDTH = 10_000;
export const MAX_VIEW_HEIGHT = 10_000;
export const MIN_VIEW_WIDTH = 3000;
export const MIN_VIEW_HEIGHT = 3000;
export const DEFAULT_VIEW_WIDTH = 5000;
export const DEFAULT_VIEW_HEIGHT = 5000;
export const VIEW_INCREASE_AMOUNT = 500;

const initiate = (
  _: Data,
  action: PayloadAction<DbGrapherSchema | undefined>
): Data => {
  return {
    past: [],
    future: [],
    present: action.payload ?? {
      dbGrapher: {
        type: DbType.NotSelected,
      },
      tables: [],
    },
  };
};

const set = (state: Data, action: PayloadAction<DbGrapherSchema>): void => {
  const { past, present } = state;
  if (present) past.push(present);
  state.past = past;
  state.present = action.payload;
  state.future = [];
};

const setDbType = (state: Data, action: PayloadAction<DbType>): void => {
  if (state.present.dbGrapher == null) {
    state.present.dbGrapher = {
      type: action.payload,
    };
  } else {
    state.present.dbGrapher.type = action.payload;
  }
};

const undo = (state: Data): void => {
  const { past, future } = state;
  let { present } = state;
  if (past.length > 0) {
    future.push(present);
    present = past.pop()!;
  }
  state.past = past;
  state.present = present;
  state.future = future;
};

const redo = (state: Data): void => {
  const { past, future } = state;
  let { present } = state;
  if (future.length > 0) {
    past.push(present);
    present = future.pop()!;
  }
  state.past = past;
  state.present = present;
  state.future = future;
};

const slice = createSlice({
  initialState: {
    past: [],
    future: [],
    present: {
      dbGrapher: {
        type: DbType.NotSelected,
      },
      tables: [],
    },
  } as Data,
  name: "schema",
  reducers: {
    initiate,
    set,
    setDbType,
    undo,
    redo,
  },
});

export const { reducer, actions } = slice;

export default slice;
