import store from "../store/store";
import { actions as schemaAction } from "../store/slices/schema";
import { driveProvider } from "../drive/factory";
import { actions as setSchemaAction } from "../store/slices/load-schema";
import { CloudUpdateState } from "../store/slices/cloud";
import { actions as cloudActions } from "../store/slices/cloud";
import {
  actions as dialogActions,
  DialogTypes,
} from "../store/slices/dialog/dialogs";
import { subscribeOnce } from "../subscribe-store";
import { DbType } from "../db-grapher-schema";

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

export const getDbType = async (): Promise<DbType> => {
  store.dispatch(dialogActions.open(DialogTypes.DbTypeDialog));
  await subscribeOnce((state) => state.dialog.dialogs.dbTypeDialog);
  return store.getState().schema.present.dbGrapher.type;
};

export const openFile = async (): Promise<void> => {
  subscribeOnce((state) => state.schema.present).then(() => {
    if (store.getState().schema.present?.dbGrapher?.type == null) {
      getDbType();
    }
  });
  await driveProvider.picker();
};

export const newFile = async (): Promise<void> => {
  store.dispatch(cloudActions.setFileName("untitled.dbgr"));
  store.dispatch(cloudActions.setUpdateState(CloudUpdateState.None));
  await getDbType();
  store.dispatch(schemaAction.initiate());
};
