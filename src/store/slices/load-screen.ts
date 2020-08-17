import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  initialState: false,
  name: "loadScreen",
  reducers: {
    start: (): boolean => true,
    stop: (): boolean => false,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
