import {
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
  Slice,
} from "@reduxjs/toolkit";

const createDialogSlice = <T, Reducers extends SliceCaseReducers<boolean>>({
  name = "",
  initialState = false,
  reducers = {} as Reducers & ValidateSliceCaseReducers<boolean, Reducers>,
}: {
  name?: string;
  initialState?: boolean;
  reducers?: ValidateSliceCaseReducers<boolean, Reducers>;
}): Slice => {
  return createSlice({
    name,
    initialState,
    reducers: {
      open: () => true,
      close: () => false,
      ...reducers,
    },
  });
};

export default createDialogSlice;
