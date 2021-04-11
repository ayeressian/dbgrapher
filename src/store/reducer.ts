import { combineReducers, Action } from "redux";
import { reducer as createCords } from "./slices/create-cords";
import { reducer as tableDialog } from "./slices/dialog/table-dialog";
import { reducer as dbViewerMode } from "./slices/db-viewer-mode";
import { reducer as fileDialog } from "./slices/dialog/file-dialog";
import { reducer as fileOpenChooserDialog } from "./slices/dialog/file-open-chooser-dialog";
import { reducer as schema } from "./slices/schema";
import { reducer as loadSchema } from "./slices/load-schema";
import { reducer as loadScreen } from "./slices/load-screen";
import { reducer as cloud } from "./slices/cloud";
import { reducer as localization } from "./slices/localization";
import { reducer as dialogs } from "./slices/dialog/dialogs";
import { reducer as dbTypeDialog } from "./slices/dialog/db-type-dialog";
import { reducer as showUnsavedWarning } from "./slices/show-unsaved-warning";
import { reducer as hint } from "./slices/hint";

const appReducer = combineReducers({
  createCords,
  dbViewerMode,
  cloud,
  hint,
  dialog: combineReducers({
    dialogs,
    dbTypeDialog,
    fileDialog,
    tableDialog,
    fileOpenChooserDialog,
  }),
  loadScreen,
  loadSchema,
  schema,
  localization,
  showUnsavedWarning,
});

export type AppState = ReturnType<typeof appReducer>;

// TODO: change unknown with proper type
const rootReducer = (state: unknown, action: Action): AppState => {
  if (action.type === "RESET") state = undefined;

  return appReducer(state as AppState, action);
};

export default rootReducer;
