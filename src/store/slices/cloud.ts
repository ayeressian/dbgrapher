import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum CloudProvider {
  None = 'None',
  GoogleDrive = 'GoogleDrive',
  OneDrive = 'OneDrive',
  NotSelected = 'NotSelected',
}

export type CloudUserData = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
};

export type CloudState = {
  provider: CloudProvider;
  userData?: CloudUserData;
  fileName?: string;
}

const slice = createSlice({
  initialState: {
    provider: CloudProvider.NotSelected,
  } as CloudState,
  name: 'cloud',
  reducers: {
    setUserData: (state, { payload }: PayloadAction<CloudUserData>): CloudState => {
      state.userData = payload;
      return state;
    },
    setDriveType: (state, { payload }: PayloadAction<CloudProvider>): CloudState => {
      state.provider = payload;
      return state;
    }, 
    setFileName: (state, { payload }: PayloadAction<string>): CloudState => {
      state.fileName = payload;
      return state;
    }
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
