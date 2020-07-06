interface DriveProvider {
  picker: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateFile: () => Promise<void>;
  createFile: () => Promise<void>;
}

export default DriveProvider;
