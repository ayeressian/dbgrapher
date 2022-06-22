import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum LocalizationState {
  ENGLISH = "ENGLISH",
  ARMENIAN = "ARMENIAN",
}

const slice = createSlice({
  initialState: LocalizationState.ENGLISH,
  name: "localization",
  reducers: {
    set: (
      _,
      { payload }: PayloadAction<LocalizationState>
    ): LocalizationState => payload,
  },
});

export default slice;

export const { reducer, actions } = slice;
