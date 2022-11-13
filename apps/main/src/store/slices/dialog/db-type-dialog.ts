import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum DbTypeDialogState {
  OpenFromWizard = "OpenFromWizard",
  OpenFromTopMenuNew = "OpenFromTopMenuNew",
  OpenFromTopMenu = "OpenFromTopMenu",
  Close = "Close",
}

export type DbTypeDialogOpenState = Exclude<
  DbTypeDialogState,
  DbTypeDialogState.Close
>;

const slice = createSlice({
  initialState: DbTypeDialogState.Close,
  name: "dbTypeDialog",
  reducers: {
    close: (): DbTypeDialogState => DbTypeDialogState.Close,
    open: (
      _,
      action: PayloadAction<DbTypeDialogOpenState>
    ): DbTypeDialogState => action.payload,
  },
});

export default slice;

export const { reducer, actions } = slice;
