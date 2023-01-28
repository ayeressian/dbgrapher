import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DbGrapherSchema from "../../db-grapher-schema";
import { DbType } from "../../db-grapher-schema";

type Data = {
  past: DbGrapherSchema[];
  present: DbGrapherSchema;
  future: DbGrapherSchema[];
};

const initiate = (
  _: Data,
  action: PayloadAction<DbGrapherSchema | undefined>
): Data => {
  return {
    past: [],
    future: [],
    present: action.payload ?? {
      dbGrapher: {
        type: "NotSelected",
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
    present = past.pop() as DbGrapherSchema;
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
    present = future.pop() as DbGrapherSchema;
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
        type: "NotSelected",
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
