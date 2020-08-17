import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum FileOpenDialogState {
  OpenFromWelcomeDialog = "OpenFromWelcomeDialog",
  OpenFromTopMenu = "OpenFromTopMenu",
  Close = "Close",
}

const slice = createSlice({
  initialState: FileOpenDialogState.Close,
  name: "fileOpenChooserDialog",
  reducers: {
    close: (): FileOpenDialogState => FileOpenDialogState.Close,
    open: (_, action: PayloadAction<boolean>): FileOpenDialogState =>
      action.payload
        ? FileOpenDialogState.OpenFromWelcomeDialog
        : FileOpenDialogState.OpenFromTopMenu,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
