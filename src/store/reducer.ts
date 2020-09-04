import { combineReducers, Action } from "redux";
import { reducer as createCords } from "./slices/create-cords";
import { reducer as tableDialog } from "./slices/dialog/table-dialog";
import { reducer as dbViewerMode } from "./slices/db-viewer-mode";
import { reducer as fileOpenDialog } from "./slices/dialog/file-dialog/file-open-dialog";
import { reducer as fileOpenChooserDialog } from "./slices/dialog/file-open-chooser-dialog";
import { reducer as fileSqlOpenDialog } from "./slices/dialog/file-dialog/file-sql-open-dialog";
import { reducer as schema } from "./slices/schema";
import { reducer as loadSchema } from "./slices/load-schema";
import { reducer as loadScreen } from "./slices/load-screen";
import { reducer as cloud } from "./slices/cloud";
import { reducer as localization } from "./slices/localization";
import { reducer as dialogs } from "./slices/dialog/dialogs";

const appReducer = combineReducers({
  createCords,
  dbViewerMode,
  cloud,
  dialog: combineReducers({
    dialogs,
    fileDialog: combineReducers({
      fileOpenDialog,
      fileSqlOpenDialog,
    }),
    tableDialog,
    fileOpenChooserDialog,
  }),
  loadScreen,
  loadSchema,
  schema,
  localization,
});

export type AppState = ReturnType<typeof appReducer>;

// TODO: change unknown with proper type
const rootReducer = (state: unknown, action: Action): AppState => {
  if (action.type === "RESET") state = undefined;

  return appReducer(state as AppState, action);
};

export default rootReducer;
