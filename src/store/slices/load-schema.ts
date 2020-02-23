import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: false,
  name: 'setSchema',
  reducers: {
    load: () => true,
    loaded: () => false, 
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
