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
  fileId?: number;
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
    setFileId: (state, { payload }: PayloadAction<number>): CloudState => {
      state.fileId = payload;
      return state;
    }
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
