import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: false,
  name: 'aboutDialog',
  reducers: {
    close: (): boolean => false,
    open: (): boolean => true,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
