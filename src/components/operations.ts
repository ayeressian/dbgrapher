import store from "../store/store";
import { actions as schemaAction } from "../store/slices/schema";
import { driveProvider } from "../drive/factory";
import { actions as setSchemaAction } from "../store/slices/load-schema";
import { CloudUpdateState } from "../store/slices/cloud";
import { actions as cloudActions } from "../store/slices/cloud";
import { actions as dbTypeDialogActions } from "../store/slices/dialog/db-type-dialog";

export const undo = (): void => {
  store.dispatch(schemaAction.undo());
  void driveProvider.updateFile();
  store.dispatch(setSchemaAction.loadViewportUnchange());
};

export const redo = (): void => {
  store.dispatch(schemaAction.redo());
  void driveProvider.updateFile();
  store.dispatch(setSchemaAction.loadViewportUnchange());
};

export const openFile = async (): Promise<void> => {
  await driveProvider.picker();
  if (store.getState().schema.present?.dbGrapher?.type == null) {
    store.dispatch(dbTypeDialogActions.open());
    store.dispatch(setSchemaAction.load());
  }
};

export const newFile = (): void => {
  store.dispatch(cloudActions.setFileName("untitled.dbgr"));
  store.dispatch(cloudActions.setUpdateState(CloudUpdateState.None));
  store.dispatch(schemaAction.initiate());
  store.dispatch(dbTypeDialogActions.open());
};
