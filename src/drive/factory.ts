import { CloudProvider, actions as cloudActions } from '../store/slices/cloud';
import { actions as schemaActions } from '../store/slices/schema';
import { actions as loadSchemaActions } from '../store/slices/load-schema';
import { actions as newOpenDialogActions } from '../store/slices/dialog/new-open-dialog';
import { actions as loadActions } from '../store/slices/load-screen';
import DriveProvider from './drive-provider';
import GoogleDriveProvider from './google-drive/google-drive-provider';
import OneDriveProvider from './one-drive/one-drive-provider';
import { subscribe } from '../subscribe-store';
import NoneProvider from './none/none-provider';
import store from '../store/store';

export let driveProvider: DriveProvider;

type OpenURIData = {
  action: "open";
  ids: string[];
  userId: string;
}

type CreateURIData = {
  action: "create";
  folderId: string;
  userId: string;
}

const initFactory = (): void => {
  subscribe(state => state.cloud.provider, provider => {
    switch(provider) {
      case CloudProvider.GoogleDrive:
        driveProvider = new GoogleDriveProvider();
        break;
      case CloudProvider.OneDrive:
        driveProvider = new OneDriveProvider();
        break;
      default:
        driveProvider = new NoneProvider();
        break;
    }
  });

  const url = new URL(window.location.href);
  const googleDriveCommon = <T extends OpenURIData | CreateURIData>(): T => {
    store.dispatch(cloudActions.setDriveType(CloudProvider.GoogleDrive));
    store.dispatch(newOpenDialogActions.close());

    const data = JSON.parse(decodeURI(url.search.substr(7)));
    return data;
  };
  switch(url.hash) {
    case '#google-drive/new':
      {
        store.dispatch(loadActions.start);
        const { folderId } = googleDriveCommon<CreateURIData>();
        store.dispatch(cloudActions.setFileName('untitled.dbgh'));
        store.dispatch(schemaActions.initiate());
        store.dispatch(loadSchemaActions.load());
        driveProvider.createFile(folderId);
        driveProvider.updateFile();
        store.dispatch(loadActions.stop);
      }
      break;
    case '#google-drive/open':
      {
        store.dispatch(loadActions.start);
        const { ids } = googleDriveCommon<OpenURIData>();
        const fileId = ids[0];
        driveProvider.open(fileId);
        store.dispatch(loadActions.stop);
      }
      break;
  }
};

export default initFactory;
