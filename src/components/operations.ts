import store from "../store/store";
import { actions as schemaAction } from "../store/slices/schema";
import { driveProvider } from "../drive/factory";
import { actions as setSchemaAction } from "../store/slices/load-schema";

export const undo = (): void => {
  store.dispatch(schemaAction.undo());
  driveProvider.updateFile();
  store.dispatch(setSchemaAction.loadViewportUnchange());
};

export const redo = (): void => {
  store.dispatch(schemaAction.redo());
  driveProvider.updateFile();
  store.dispatch(setSchemaAction.loadViewportUnchange());
};
