import { createSlice } from "@reduxjs/toolkit";
import { actions as schemaActions } from "./schema";

const slice = createSlice({
  initialState: false,
  name: "showUnsavedWarning",
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(schemaActions.initiate, () => false)
      .addCase(schemaActions.set, () => true),
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
