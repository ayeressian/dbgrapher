import DriveProvider from "../drive-provider";
import store from "../../store/store";
import { actions as fileOpenDialog } from "../../store/slices/dialog/file-dialog/file-open-dialog";

export default class NoneProvider implements DriveProvider {
  picker(): Promise<void> {
    store.dispatch(fileOpenDialog.open());
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
  createFile(): Promise<void>  {
    return Promise.resolve();
  }
  renameFile(): Promise<void>  {
    return Promise.resolve();
  }
}