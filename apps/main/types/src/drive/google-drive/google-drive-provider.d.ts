import DriveProvider from "../drive-provider";
export default class GoogleDriveProvider extends DriveProvider {
    #private;
    static developerKey: string;
    static clientId: string;
    static appId: string;
    static scopeDriveFile: string;
    static scopeDriveInstall: string;
    static scope: string;
    constructor();
    open(fileId: string, fileName?: string): Promise<void>;
    picker(): Promise<void>;
    login(): Promise<boolean>;
    logout(): Promise<never>;
    updateFile(isRetry?: boolean): Promise<void>;
    createFile(folderId?: string): Promise<void>;
    renameFile(newFileName: string): Promise<void>;
}
