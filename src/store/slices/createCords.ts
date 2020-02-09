
import types from '../../../node_modules/db-viewer-component/dist/index';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IPointNullable = IPoint | null;

const slice = createSlice({
  initialState: null as IPointNullable,
  name: 'createCord',
  reducers: {
    setCord: (_, action: PayloadAction<IPointNullable>) => action.payload,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
