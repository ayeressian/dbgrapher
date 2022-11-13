import { createSlice } from "@reduxjs/toolkit";
import { Point } from "db-viewer-component";

type TableDialogData = {
  open: boolean;
  tableName?: string;
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
      cords: cords as Point,
    }),
    openEdit: (_, { payload: tableName }): TableDialogData => ({
      tableName: tableName as string,
      open: true,
      cords: undefined,
    }),
  },
});

export default slice;

export const { reducer, actions } = slice;
