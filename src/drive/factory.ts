import { CloudProvider } from '../store/slices/cloud';
import DriveProvider from './drive-provider';
import GoogleDriveProvider from './google-drive/google-drive-provider';
import OneDriveProvider from './one-drive/one-drive-provider';
import { subscribe } from '../subscribe-store';

export let driveProvider: DriveProvider;

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
        throw new Error('Unknown cloud provider');
    }
  });
};

export default initFactory;
