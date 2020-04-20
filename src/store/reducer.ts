import { combineReducers, Action } from 'redux';
import { reducer as createCords } from './slices/create-cords';
import { reducer as tableDialog } from './slices/create-dialog';
import { reducer as dbViewerMode } from './slices/db-viewer-mode';
import { reducer as fileOpenDialog } from './slices/file-open-dialog';
import { reducer as fileSqlOpenDialog } from './slices/file-sql-open-dialog';
import { reducer as schema } from './slices/schema';
import { reducer as welcomeDialog } from './slices/welcome-dialog';
import { reducer as topMenuConfig } from './slices/top-menu-config';
import { reducer as loadSchema } from './slices/load-schema';

const appReducer = combineReducers({
  createCords,
  dbViewerMode,
  topMenuConfig,
  dialog: combineReducers({
    fileDialog: combineReducers({
      fileOpenDialog,
      fileSqlOpenDialog,
    }),
    tableDialog,
    welcomeDialog,
  }),
  loadSchema,
  schema,
});

export type AppState = ReturnType<typeof appReducer>;

// TODO: change unknown with proper type
const rootReducer = (state: unknown, action: Action): AppState => {
  if (action.type === 'RESET') state = undefined;

  return appReducer(state as AppState, action);
};

export default rootReducer;
