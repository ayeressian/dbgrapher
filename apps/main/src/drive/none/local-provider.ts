import DriveProvider from "../drive-provider";
import store from "../../store/store";
import {
  actions as fileDialog,
  FileDialogState,
} from "../../store/slices/dialog/file-dialog";
import { subscribeOnce } from "../../subscribe-store";

export default class LocalProvider extends DriveProvider {
  async picker(): Promise<void> {
    store.dispatch(fileDialog.open(FileDialogState.OpenDialog));
    await subscribeOnce((state) => state.dialog.fileDialog);
  }
  async save(): Promise<void> {
    store.dispatch(fileDialog.open(FileDialogState.SaveDialog));
    await subscribeOnce((state) => state.dialog.fileDialog);
  }
  async saveAs(): Promise<void> {
    store.dispatch(fileDialog.open(FileDialogState.SaveAsDialog));
    await subscribeOnce((state) => state.dialog.fileDialog);
  }
}
