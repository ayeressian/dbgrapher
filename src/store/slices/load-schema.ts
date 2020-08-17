import { createSlice } from "@reduxjs/toolkit";

export enum State {
  LOAD = "LOAD",
  LOAD_VIEWPORT_UNCHANGE = "LOAD_VIEWPORT_UNCHANGE",
  DEFAULT = "DEFAULT",
}

const slice = createSlice({
  initialState: State.LOAD,
  name: "setSchema",
  reducers: {
    load: (): State => State.LOAD,
    loadViewportUnchange: (): State => State.LOAD_VIEWPORT_UNCHANGE,
    loaded: (): State => State.DEFAULT,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
