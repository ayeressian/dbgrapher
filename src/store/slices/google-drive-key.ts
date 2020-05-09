import { createSlice } from '@reduxjs/toolkit';

type GoogleDriveKey = string | null;

const slice = createSlice({
  initialState: null as GoogleDriveKey,
  name: 'googleDialogKey',
  reducers: {
    clean: (): GoogleDriveKey => null,
    set: (_, {payload: key}): GoogleDriveKey => key,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
