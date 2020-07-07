import store from '../../store/store';
import { actions as schemaAction } from '../../store/slices/schema';
import { actions as setSchemaAction } from '../../store/slices/load-schema';
import env from '../../../env.json';
import { actions as loadScreenAction } from '../../store/slices/load-screen';
import { actions as cloudActions } from '../../store/slices/cloud';
import DriveProvider from '../drive-provider';
import { Schema } from 'db-viewer-component';

const auth2Load = new Promise((resolve, reject) => {
  gapi.load('auth2', {callback: resolve, onerror: reject});
});

const pickerLoad = new Promise((resolve, reject) => {
  gapi.load('picker', {callback: resolve, onerror: reject});
});

let clientDrive: Promise<void>;
const clientLoad = new Promise((resolve, reject) => {
  gapi.load('client', {callback: () => {
    clientDrive = gapi.client.load('drive', 'v2');
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
      await clientDrive;
      const filesContent = await gapi.client.drive.files.get({
        fileId: file.id,
        alt: 'media'
      });
      store.dispatch(loadScreenAction.stop());
      store.dispatch(schemaAction.initiate((filesContent.result as unknown) as Schema));
      store.dispatch(setSchemaAction.load());
    }
  };

  async picker(): Promise<void> {
    await this.#initPromise;
    if (!gapi.auth2.getAuthInstance().isSignedIn) {
      await this.login();
    }
    store.dispatch(loadScreenAction.start());
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
    return Promise.resolve();
  }

  async login(): Promise<void> {
    await auth2Load;
    store.dispatch(loadScreenAction.start());

    const user = await gapi.auth2.getAuthInstance().signIn();
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
    return Promise.resolve();
  }

  async logout(): Promise<void> {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    authInstance.disconnect();
    return Promise.resolve();
  }

  updateFile = async (): Promise<void> => {
    await gapi.client.request({
      path: `https://www.googleapis.com/upload/drive/v2/files/${this.#fileId}`,
      body: store.getState().schema.present,
      method: 'PUT',
    });
  }

  createFile(): Promise<void>  {
    //TODO
    return Promise.resolve();
  }
}
