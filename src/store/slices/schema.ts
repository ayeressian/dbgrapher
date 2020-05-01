import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deepCopy } from '../../util';
import { Schema } from 'db-viewer-component';

type Data = {
  past: Schema[];
  present: Schema;
  future: Schema[];
};

const slice = createSlice({
  initialState: {
    past: [],
    future: [],
    present: {tables: []}
  } as Data,
  name: 'schema',
  reducers: {
    initiate: (_, action: PayloadAction<Schema | undefined>): Data => {
      return {
        past: [],
        future: [],
        present: action.payload ?? {tables: []}
      };
    },
    set: (state, action: PayloadAction<Schema>): Data => {
      const {past, present} = deepCopy(state);
      if (present) past.push(present);
      return {
        past,
        present: action.payload,
        future: []
      };
    },
    undo: (state): Data => {
      const newState = deepCopy(state);
      const {past, future} = newState;
      let { present } = newState;
      if (past.length > 0) {
        future.push(present);
        present = past.pop()!;
      }
      return {
        past,
        future,
        present,
      };
    },
    redo: (state): Data => {
      const newState = deepCopy(state);
      const {past, future} = newState;
      let { present } = newState;
      if (future.length > 0) {
        past.push(present);
        present = future.pop()!;
      }
      return {
        past,
        future,
        present,
      };
    },
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
