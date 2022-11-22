import DriveProvider from "../drive-provider";
export default class LocalProvider extends DriveProvider {
    picker(): Promise<void>;
    save(): Promise<void>;
    saveAs(): Promise<void>;
}
