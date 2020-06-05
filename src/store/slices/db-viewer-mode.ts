import { createSlice } from '@reduxjs/toolkit';
import { IDbViewerMode } from './db-viewer-mode-interface';

const slice = createSlice({
  initialState: IDbViewerMode.None,
  name: 'dbViewerMode',
  reducers: {
    createMode: (): IDbViewerMode => IDbViewerMode.Create,
    none: (): IDbViewerMode => IDbViewerMode.None,
    relationMode: (): IDbViewerMode => IDbViewerMode.RelationOneToMany,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
