/* eslint-disable @typescript-eslint/no-unused-vars */
class DriveProvider {
  picker(): Promise<void> {
    return Promise.resolve();
  }

  login(): Promise<boolean> {
    return Promise.resolve(true);
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }

  updateFile(): Promise<void> {
    return Promise.resolve();
  }

  createFile(_folderId: string): Promise<void> {
    return Promise.resolve();
  }

  renameFile(_newFileName: string): Promise<void> {
    return Promise.resolve();
  }

  save(): Promise<void> {
    return Promise.resolve();
  }

  saveAs(): Promise<void> {
    return Promise.resolve();
  }
}

export default DriveProvider;
