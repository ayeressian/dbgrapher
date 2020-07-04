interface DriveProvider {
  picker: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  update: () => Promise<void>;
}

export default DriveProvider;
