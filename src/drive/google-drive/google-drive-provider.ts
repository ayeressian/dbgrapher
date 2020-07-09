import store from '../../store/store';
import { actions as schemaAction } from '../../store/slices/schema';
import { actions as setSchemaAction } from '../../store/slices/load-schema';
import env from '../../../env.json';
import { actions as loadScreenAction } from '../../store/slices/load-screen';
import { actions as cloudActions, CloudUpdateState } from '../../store/slices/cloud';
import DriveProvider from '../drive-provider';
import { Schema } from 'db-viewer-component';

const auth2Load = new Promise((resolve, reject) => {
  gapi.load('auth2', {callback: resolve, onerror: reject});
});

const pickerLoad = new Promise((resolve, reject) => {
  gapi.load('picker', {callback: resolve, onerror: reject});
});

let clientDriveLoad: PromiseLike<void>;
const clientLoad = new Promise((resolve, reject) => {
  gapi.load('client', {callback: () => {
    clientDriveLoad = gapi.client.load('drive', 'v3');
    resolve();
  }, onerror: reject});
});

export default class GoogleDriveProvider implements DriveProvider {
  // The Browser API key obtained from the Google API Console.
  // Replace with your own Browser API key, or your own key.
  static developerKey: string = env.googleDrive.developerKey;
  // The Client ID obtained from the Google API Console. Replace with your own Client ID.
  static clientId: string = env.googleDrive.clientId;
  // Replace with your own project number from console.developers.google.com.
  // See "Project number" under "IAM & Admin" > "Settings"
  static appId: string = env.googleDrive.appId
  
  // Scope to use to access user's Drive items.
  static scope = 'https://www.googleapis.com/auth/drive.file';

  #initPromise: Promise<void>;
  #fileId?: string;
  #pickerPromise?: Promise<void>;
  #pickerPromiseResolve?: () => void;

  constructor() {
    this.#initPromise = new Promise((resolve, reject) => {
      clientLoad.then(() => {
        gapi.client.init({
          apiKey: GoogleDriveProvider.developerKey,
          clientId: GoogleDriveProvider.clientId,
          scope: GoogleDriveProvider.scope
        }).then(resolve).catch(reject);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #pickerCallback = async (data: any): Promise<void> => {
    if (data.action == google.picker.Action.PICKED) {
      store.dispatch(loadScreenAction.start());
      const file = data.docs[0];
      this.#fileId = file.id;
      store.dispatch(cloudActions.setFileName(file.name));
      await clientDriveLoad;
      const filesContent = await gapi.client.drive.files.get({
        fileId: file.id,
        alt: 'media'
      });
      store.dispatch(cloudActions.setUpdateState(CloudUpdateState.Saved));
      store.dispatch(schemaAction.initiate((filesContent.result as unknown) as Schema));
      store.dispatch(setSchemaAction.load());
    }
    if ([google.picker.Action.PICKED, google.picker.Action.CANCEL].includes(data.action)) {
      this.#pickerPromiseResolve!();
    }
  };

  async picker(): Promise<void> {
    store.dispatch(loadScreenAction.start());
    await this.#initPromise;

    this.#pickerPromise = new Promise((resolve) => this.#pickerPromiseResolve = resolve);
    if (!gapi.auth2.getAuthInstance().isSignedIn) {
      await this.login();
    }
    await pickerLoad;
    const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
    view.setMimeTypes("application/JSON");
    const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .setAppId(GoogleDriveProvider.appId)
        .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setDeveloperKey(GoogleDriveProvider.developerKey)
        .setCallback(this.#pickerCallback)
        .build();
    picker.setVisible(true);
    await this.#pickerPromise;
    store.dispatch(loadScreenAction.stop());
  }

  async login(): Promise<boolean> {
    store.dispatch(loadScreenAction.start());
    await auth2Load;
    let user;
    try {
      user = await gapi.auth2.getAuthInstance().signIn();
    } catch(error) {
      if (error.error === 'popup_closed_by_user') {
        store.dispatch(loadScreenAction.stop());    
        return false;
      }
      throw error;
    }
    const profile = user.getBasicProfile();
    user.getAuthResponse().access_token;

    store.dispatch(cloudActions.setUserData({
      name: profile.getName(),
      firstName: profile.getGivenName(),
      lastName: profile.getFamilyName(),
      email: profile.getEmail(),
      picture: profile.getImageUrl(),
    }));

    store.dispatch(loadScreenAction.stop());
    return true;
  }

  async logout(): Promise<void> {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    authInstance.disconnect();
    store.dispatch({type: 'RESET'});
    return Promise.resolve();
  }

  async updateFile(): Promise<void> {
    store.dispatch(cloudActions.setUpdateState(CloudUpdateState.Saving));
    if (this.#fileId == null) {
      await this.createFile();
    }
    await clientLoad;
    await gapi.client.request({
      path: `https://www.googleapis.com/upload/drive/v2/files/${this.#fileId}`,
      body: store.getState().schema.present,
      method: 'PUT',
    });
    store.dispatch(cloudActions.setUpdateState(CloudUpdateState.Saved));
  }

  async createFile(): Promise<void>  {
    const fileName = store.getState().cloud.fileName!;
    await clientDriveLoad;
    const file = await gapi.client.drive.files.create({
      resource: {
        name: fileName,
        mimeType: 'application/json',
      }
    });
    this.#fileId = file.result.id;
  }

  async renameFile(newFileName: string): Promise<void> {
    if (this.#fileId) {
      await clientDriveLoad;
      await gapi.client.drive.files.update({
        fileId: this.#fileId,
        resource: {
          name: newFileName
        }
      });
    }
    store.dispatch(cloudActions.setFileName(newFileName));
  }
}
