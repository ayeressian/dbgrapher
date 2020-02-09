import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const slice = createSlice({
  initialState: null as ISchema | null,
  name: 'schema',
  reducers: {
    setSchema: (_, action: PayloadAction<ISchema>): ISchema => action.payload,
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
