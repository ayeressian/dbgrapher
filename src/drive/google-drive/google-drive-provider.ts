import store from '../../store/store';
import { actions as schemaAction } from '../../store/slices/schema';
import { actions as setSchemaAction } from '../../store/slices/load-schema';
import { actions as cloudActions } from '../../store/slices/cloud';
import { actions as fileOpenChooserAction } from "../../store/slices/dialog/file-open-chooser-dialog";
import env from '../../../env.json';
import { actions as loadScreenAction } from '../../store/slices/load-screen';
import { CloudProvider, actions as cloudAction } from '../../store/slices/cloud';
import DriveProvider from '../drive-provider';

const auth2Load = new Promise((resolve, reject) => {
  gapi.load('auth2', {callback: resolve, onerror: reject});
});

const pickerLoad = new Promise((resolve, reject) => {
  gapi.load('picker', {callback: resolve, onerror: reject});
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

  constructor() {
    gapi.client.init({
      apiKey: GoogleDriveProvider.developerKey,
      clientId: GoogleDriveProvider.clientId,
      scope: GoogleDriveProvider.scope
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #pickerCallback = async (data: any): Promise<void> => {
    if (data.action == google.picker.Action.PICKED) {
      store.dispatch(loadScreenAction.start());
      const file = data.docs[0];
      const filesResult = await gapi.client.request({
        path: `https://www.googleapis.com/drive/v2/files/${file.id}`,
        params: {
          mimeType: file.mimeType
        }
      });
      store.dispatch(cloudActions.setFileId(file.id));
      store.dispatch(fileOpenChooserAction.close());
      const contentData = await gapi.client.request({
        path: filesResult.result.downloadUrl
      });
      store.dispatch(loadScreenAction.stop());
      store.dispatch(schemaAction.initiate(contentData.result));
      store.dispatch(setSchemaAction.load());
    }
  };

  async picker(): Promise<void> {
    if (!gapi.auth2.getAuthInstance().isSignedIn) {
      await this.login();
    }
    store.dispatch(loadScreenAction.start());
    await pickerLoad;
    const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
    view.setMimeTypes("application/JSON");
    const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
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

    store.dispatch(cloudAction.setUserData({
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

  update = async (): Promise<void> => {
    const key = store.getState().cloud.fileId;
    if (key && store.getState().cloud.provider === CloudProvider.GoogleDrive) {
      if (store.getState().cloud.provider === CloudProvider.GoogleDrive) {
        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        await gapi.client.request({
          path: `https://www.googleapis.com/upload/drive/v2/files/${accessToken}`,
          body: store.getState().schema.present,
          method: 'PUT',
        });
      }
    }
  }
}
