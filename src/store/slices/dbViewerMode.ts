import { createSlice } from '@reduxjs/toolkit';
import { IDbViewerMode } from './IDbViewerMode';

const slice = createSlice({
  initialState: IDbViewerMode.None,
  name: 'dbViewerMode',
  reducers: {
    createMode: () => IDbViewerMode.Create,
    none: () => IDbViewerMode.None,
    relationMode: () => IDbViewerMode.Relation,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
