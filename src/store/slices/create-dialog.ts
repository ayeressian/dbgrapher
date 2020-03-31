import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: {
    open: false,
    tableName: undefined as undefined | string,
    cords: undefined as {
      x: number;
      y: number;
    } | undefined,
  },
  name: 'tableDialog',
  reducers: {
    close: () => ({tableName: undefined, open: false, cords: undefined}),
    openCreate: (_, {payload: cords}) => ({tableName: undefined, open: true, cords}),
    openEdit: (_, {payload: tableName}) => ({tableName, open: true, cords: undefined}),
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
