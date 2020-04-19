
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Point from 'db-viewer-component';

type IPointNullable = Point | null;

const slice = createSlice({
  initialState: null as IPointNullable,
  name: 'createCord',
  reducers: {
    setCord: (_, action: PayloadAction<IPointNullable>): IPointNullable => action.payload,
  },
});
console.log(slice);
export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
