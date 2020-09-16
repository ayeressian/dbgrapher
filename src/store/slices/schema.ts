import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DbGrapherSchema from "../../db-grapher-schema";
import { DbType } from "../../db-grapher-schema";
import store from "../store";

type Data = {
  past: DbGrapherSchema[];
  present: DbGrapherSchema;
  future: DbGrapherSchema[];
};

const slice = createSlice({
  initialState: {
    past: [],
    future: [],
    present: {
      dbGrapher: {
        type: DbType.Generic,
      },
      tables: [],
    },
  } as Data,
  name: "schema",
  reducers: {
    initiate: (
      state,
      action: PayloadAction<DbGrapherSchema | undefined>
    ): Data => {
      return {
        past: [],
        future: [],
        present: action.payload ?? {
          dbGrapher: {
            type: state.present.dbGrapher.type ?? DbType.Generic,
          },
          tables: [],
        },
      };
    },
    set: (state, action: PayloadAction<DbGrapherSchema>): void => {
      const { past, present } = state;
      if (present) past.push(present);
      state.past = past;
      state.present = action.payload;
      state.future = [];
    },
    setDbType: (state, action: PayloadAction<DbType>): void => {
      if (state.present.dbGrapher == null) {
        state.present.dbGrapher = {
          type: action.payload,
        };
      } else {
        state.present.dbGrapher.type = action.payload;
      }
    },
    undo: (state): void => {
      const { past, future } = state;
      let { present } = state;
      if (past.length > 0) {
        future.push(present);
        present = past.pop()!;
      }
      state.past = past;
      state.present = present;
      state.future = future;
    },
    redo: (state): void => {
      const { past, future } = state;
      let { present } = state;
      if (future.length > 0) {
        past.push(present);
        present = future.pop()!;
      }
      state.past = past;
      state.present = present;
      state.future = future;
    },
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
