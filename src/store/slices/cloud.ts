import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum CloudProvider {
  None = 'None',
  GoogleDrive = 'GoogleDrive',
  OneDrive = 'OneDrive',
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
    provider: CloudProvider.None,
  } as CloudState,
  name: 'cloud',
  reducers: {
    none: (state): CloudState => {
      state.provider = CloudProvider.None;
      return state;
    },
    googleDrive: (state, { payload }: PayloadAction<CloudUserData>): CloudState => {
      state.provider = CloudProvider.GoogleDrive;
      state.userData = payload;
      return state;
    },
    oneDrive: (state, { payload }: PayloadAction<CloudUserData>): CloudState => {
      state.provider = CloudProvider.OneDrive;
      state.userData = payload;
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
