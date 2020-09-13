import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum DbTypeDialogState {
  OpenFromWizard = "OpenFromWizard",
  OpenFromTopMenu = "OpenFromTopMenu",
  Close = "Close",
}

const slice = createSlice({
  initialState: DbTypeDialogState.Close,
  name: "dbTypeDialog",
  reducers: {
    close: (): DbTypeDialogState => DbTypeDialogState.Close,
    open: (_, action: PayloadAction<boolean>): DbTypeDialogState =>
      action.payload
        ? DbTypeDialogState.OpenFromWizard
        : DbTypeDialogState.OpenFromTopMenu,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
