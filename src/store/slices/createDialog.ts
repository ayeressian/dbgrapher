import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: false,
  name: 'tableDialog',
  reducers: {
    close: () => false,
    open: () => true,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
