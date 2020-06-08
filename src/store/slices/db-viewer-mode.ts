import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDbViewerMode } from './db-viewer-mode-interface';

const slice = createSlice({
  initialState: IDbViewerMode.None,
  name: 'dbViewerMode',
  reducers: {
    none: (): IDbViewerMode => IDbViewerMode.None,
    changeMode: (_, { payload }: PayloadAction<IDbViewerMode>): IDbViewerMode => payload
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
