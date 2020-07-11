interface DriveProvider {
  picker: () => Promise<void>;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateFile: () => Promise<void>;
  createFile: (folderId: string) => Promise<void>;
  renameFile: (newfileName: string) => Promise<void>;
  open: (fileId: string) => Promise<void>;
}

export default DriveProvider;
