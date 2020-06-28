import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum State {
  OpenFromWelcomeDialog,
  OpenFromTopMenu,
  Close
}

const slice = createSlice({
  initialState: State.Close,
  name: 'fileOpenChooserDialog',
  reducers: {
    close: (): State => State.Close,
    open: (_, action: PayloadAction<boolean>): State => action.payload? State.OpenFromWelcomeDialog: State.OpenFromTopMenu,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
