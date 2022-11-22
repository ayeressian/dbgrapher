declare class DriveProvider {
    picker(): Promise<void>;
    login(): Promise<boolean>;
    logout(): Promise<void>;
    updateFile(): Promise<void>;
    createFile(_folderId: string): Promise<void>;
    renameFile(_newFileName: string): Promise<void>;
    save(): Promise<void>;
    saveAs(): Promise<void>;
}
export default DriveProvider;
