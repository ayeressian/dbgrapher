import { CloudProvider, actions as cloudActions } from "../store/slices/cloud";
import { actions as schemaActions } from "../store/slices/schema";
import { actions as loadSchemaActions } from "../store/slices/load-schema";
import {
  actions as dialogActions,
  DialogTypes,
} from "../store/slices/dialog/dialogs";
import { actions as loadActions } from "../store/slices/load-screen";
import DriveProvider from "./drive-provider";
import GoogleDriveProvider from "./google-drive/google-drive-provider";
import OneDriveProvider from "./one-drive/one-drive-provider";
import { subscribe } from "../subscribe-store";
import LocalProvider from "./none/local-provider";
import store from "../store/store";

let driveProvider: DriveProvider;

export const getDriveProvider = (): DriveProvider => driveProvider;

type OpenURIData = {
  action: "open";
  ids: string[];
  userId: string;
};

type CreateURIData = {
  action: "create";
  folderId: string;
  userId: string;
};

const googleDriveCommon = <T extends OpenURIData | CreateURIData>(
  url: URL
): T => {
  store.dispatch(cloudActions.setDriveType(CloudProvider.GoogleDrive));
  store.dispatch(dialogActions.close(DialogTypes.CloudProviderChooserDialog));

  const data = JSON.parse(decodeURI(url.search.substr(7)));
  return data;
};

const googleDriveNew = (url: URL) => {
  store.dispatch(loadActions.start);
  const { folderId } = googleDriveCommon<CreateURIData>(url);
  store.dispatch(cloudActions.setFileName("untitled.dbgr"));
  store.dispatch(schemaActions.initiate());
  store.dispatch(loadSchemaActions.load());
  driveProvider.createFile(folderId);
  driveProvider.updateFile();
  store.dispatch(loadActions.stop);
};

const googleDriveOpen = (url: URL) => {
  store.dispatch(loadActions.start);
  const { ids } = googleDriveCommon<OpenURIData>(url);
  const fileId = ids[0];
  (driveProvider as GoogleDriveProvider).open(fileId);
  store.dispatch(loadActions.stop);
};

const initFactory = (): void => {
  subscribe(
    (state) => state.cloud.provider,
    (provider) => {
      switch (provider) {
        case CloudProvider.GoogleDrive:
          driveProvider = new GoogleDriveProvider();
          break;
        case CloudProvider.OneDrive:
          driveProvider = new OneDriveProvider();
          break;
        default:
          driveProvider = new LocalProvider();
          break;
      }
    }
  );

  const url = new URL(window.location.href);

  switch (url.hash) {
    case "#google-drive/new":
      googleDriveNew(url);
      break;
    case "#google-drive/open":
      googleDriveOpen(url);
      break;
  }
};

export default initFactory;
