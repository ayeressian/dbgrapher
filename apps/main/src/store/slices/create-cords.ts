import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "db-viewer";

type IPointNullable = Point | null;

const slice = createSlice({
  initialState: null as IPointNullable,
  name: "createCord",
  reducers: {
    setCord: (_, action: PayloadAction<IPointNullable>): IPointNullable =>
      action.payload,
  },
});

export default slice;

export const { reducer, actions } = slice;
