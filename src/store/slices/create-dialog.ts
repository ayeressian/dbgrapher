import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: {
    open: false,
    tableName: undefined as undefined | string,
  },
  name: 'tableDialog',
  reducers: {
    close: () => ({tableName: undefined, open: false}),
    openCreate: () => ({tableName: undefined, open: true}),
    openEdit: (_, {payload: tableName}: PayloadAction<string | undefined>) => ({tableName, open: true}),
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
