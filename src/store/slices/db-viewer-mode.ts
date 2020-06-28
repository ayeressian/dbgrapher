import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DbViewerMode from './db-viewer-mode-type';

const slice = createSlice({
  initialState: DbViewerMode.None,
  name: 'dbViewerMode',
  reducers: {
    none: (): DbViewerMode => DbViewerMode.None,
    changeMode: (_, { payload }: PayloadAction<DbViewerMode>): DbViewerMode => payload
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
