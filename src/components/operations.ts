import store from "../store/store";
import { actions as schemaAction } from "../store/slices/schema";
import { getDriveProvider } from "../drive/factory";
import { actions as setSchemaAction } from "../store/slices/load-schema";
import { CloudProvider, CloudUpdateState } from "../store/slices/cloud";
import { actions as cloudActions } from "../store/slices/cloud";
import { actions as loadSchemaActions } from "../store/slices/load-schema";
import {
  actions as dbTypeDialogActions,
  DbTypeDialogOpenState,
  DbTypeDialogState,
} from "../store/slices/dialog/db-type-dialog";
import { subscribeOnce } from "../subscribe-store";
import { DbType } from "../db-grapher-schema";
import { FileDialogState } from "../store/slices/dialog/file-dialog";
import { FileOpenDialogState } from "../store/slices/dialog/file-open-chooser-dialog";
import { DialogTypes } from "../store/slices/dialog/dialogs";

export const undo = (): void => {
  store.dispatch(schemaAction.undo());
  void getDriveProvider().updateFile();
  store.dispatch(setSchemaAction.loadViewportUnchange());
};

export const redo = (): void => {
  store.dispatch(schemaAction.redo());
  void getDriveProvider().updateFile();
  store.dispatch(setSchemaAction.loadViewportUnchange());
};

export const getDbType = async (
  dbTypeDialogOpenState: DbTypeDialogOpenState
): Promise<DbType> => {
  store.dispatch(dbTypeDialogActions.open(dbTypeDialogOpenState));
  await subscribeOnce((state) => state.dialog.dbTypeDialog);
  return store.getState().schema.present.dbGrapher.type;
};

export const openFile = async (): Promise<void> => {
  const driveProvider = getDriveProvider();
  if (driveProvider) {
    subscribeOnce((state) => state.schema.present).then(() => {
      if (store.getState().schema.present?.dbGrapher?.type == null) {
        store.dispatch(schemaAction.setDbType(DbType.Generic));
      }
    });
    await driveProvider.picker();
  }
};

export const newFile = async (): Promise<void> => {
  if (store.getState().cloud.provider !== CloudProvider.Local) {
    store.dispatch(cloudActions.setFileName("untitled.dbgr"));
    store.dispatch(cloudActions.setUpdateState(CloudUpdateState.None));
  }
  store.dispatch(schemaAction.initiate());
  store.dispatch(loadSchemaActions.load());
  await getDbType(DbTypeDialogState.OpenFromTopMenuNew);
};

export const localDrive = (): boolean => {
  return store.getState().cloud.provider === CloudProvider.Local;
};

export const googleDrive = (): boolean => {
  return store.getState().cloud.provider === CloudProvider.GoogleDrive;
};

export const getDialogsAreClosed = (): boolean => {
  const dialogs = store.getState().dialog;

  return (
    dialogs.fileDialog === FileDialogState.None &&
    dialogs.dbTypeDialog === DbTypeDialogState.Close &&
    dialogs.fileOpenChooserDialog === FileOpenDialogState.Close &&
    !dialogs.tableDialog.open &&
    !dialogs.dialogs[DialogTypes.AboutDialog] &&
    !dialogs.dialogs[DialogTypes.CloudProviderChooserDialog] &&
    !dialogs.dialogs[DialogTypes.NewOpenDialog]
  );
};
