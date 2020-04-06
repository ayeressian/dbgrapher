import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: false,
  name: 'setSchema',
  reducers: {
    load: (): boolean => true,
    loaded: (): boolean => false, 
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
