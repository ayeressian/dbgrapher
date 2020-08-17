import { createSlice } from "@reduxjs/toolkit";
import { Point } from "db-viewer-component";

type TableDialogData = {
  open: boolean;
  tableName?: undefined;
  cords?: Point;
};

const slice = createSlice({
  initialState: {
    open: false,
  } as TableDialogData,
  name: "tableDialog",
  reducers: {
    close: (): TableDialogData => ({
      tableName: undefined,
      open: false,
      cords: undefined,
    }),
    openCreate: (_, { payload: cords }): TableDialogData => ({
      tableName: undefined,
      open: true,
      cords,
    }),
    openEdit: (_, { payload: tableName }): TableDialogData => ({
      tableName,
      open: true,
      cords: undefined,
    }),
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
