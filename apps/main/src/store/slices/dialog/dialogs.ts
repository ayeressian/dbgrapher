import { createSlice } from "@reduxjs/toolkit";

export enum DialogTypes {
  AboutDialog = "aboutDialog",
  NewOpenDialog = "newOpenDialog",
  CloudProviderChooserDialog = "cloudProviderChooserDialog",
}

type DialogsState = { [type in DialogTypes]: boolean };

const slice = createSlice({
  initialState: {
    [DialogTypes.AboutDialog]: false,
    [DialogTypes.NewOpenDialog]: true,
    [DialogTypes.CloudProviderChooserDialog]: false,
  } as DialogsState,
  name: "dialogs",
  reducers: {
    close: (state, { payload: dialogType }: { payload: DialogTypes }): void => {
      state[dialogType] = false;
    },
    open: (state, { payload: dialogType }: { payload: DialogTypes }): void => {
      state[dialogType] = true;
    },
  },
});

export default slice;

export const { reducer, actions } = slice;
