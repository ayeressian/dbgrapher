interface DriveProvider {
  picker: () => Promise<void>;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateFile: () => Promise<void>;
  createFile: () => Promise<void>;
  renameFile: (newfileName: string) => Promise<void>;
}

export default DriveProvider;
