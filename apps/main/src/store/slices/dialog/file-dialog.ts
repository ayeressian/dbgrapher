import { createSlice } from "@reduxjs/toolkit";

export enum FileDialogState {
  OpenDialog = "OpenDialog",
  SaveDialog = "SaveDialog",
  SaveAsDialog = "SaveAsDialog",
  OpenSqlDialog = "OpenSqlDialog",
  None = "None",
}

const slice = createSlice({
  initialState: FileDialogState.None,
  name: "fileDialog",
  reducers: {
    close: (): FileDialogState => FileDialogState.None,
    open: (_, { payload: fileDialogState }): FileDialogState => fileDialogState,
  },
});

export default slice;

export const { reducer, actions } = slice;
