import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "db-viewer-component";

type Data = {
  past: Schema[];
  present: Schema;
  future: Schema[];
};

const slice = createSlice({
  initialState: {
    past: [],
    future: [],
    present: { tables: [] },
  } as Data,
  name: "schema",
  reducers: {
    initiate: (_, action: PayloadAction<Schema | undefined>): Data => {
      return {
        past: [],
        future: [],
        present: action.payload ?? { tables: [] },
      };
    },
    set: (state, action: PayloadAction<Schema>): void => {
      const { past, present } = state;
      if (present) past.push(present);
      state.past = past;
      state.present = action.payload;
      state.future = [];
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
