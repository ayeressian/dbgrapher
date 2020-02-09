import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: true,
  name: 'welcomeDialog',
  reducers: {
    close: () => false,
    open: () => true,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
