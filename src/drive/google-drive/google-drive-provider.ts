import store from '../../store/store';
import { actions as schemaAction } from '../../store/slices/schema';
import { actions as setSchemaAction } from '../../store/slices/load-schema';
import { actions as cloudActions } from '../../store/slices/cloud';
import { actions as fileOpenChooserAction } from "../../store/slices/dialog/file-open-chooser-dialog";
import env from '../../../env.json';
import { actions as loadScreenAction } from '../../store/slices/load-screen';
import { CloudProvider, actions as cloudAction } from '../../store/slices/cloud';
import DriveProvider from '../drive-provider';

const authLoad = new Promise((resolve, reject) => {
  gapi.load('auth', {callback: resolve, onerror: reject});  
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
  static scope = ['https://www.googleapis.com/auth/drive.file'];

  #oauthToken?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #pickerCallback = (data: any): void => {
    if (data.action == google.picker.Action.PICKED) {
      store.dispatch(loadScreenAction.start());
      const file = data.docs[0];
      gapi.client.request({
        path: `https://www.googleapis.com/drive/v2/files/${file.id}`,
        params: {
          mimeType: file.mimeType
        }
      }).then((data) => {
        store.dispatch(cloudActions.setFileId(file.id));
        store.dispatch(fileOpenChooserAction.close());
        return gapi.client.request({
          path: data.result.downloadUrl
        }).then(contentData => {
          store.dispatch(loadScreenAction.stop());
          store.dispatch(schemaAction.initiate(contentData.result));
          store.dispatch(setSchemaAction.load());
        });
      }).catch(error => {
        console.error(error);
      });
    }
  };

  async picker(): Promise<void> {
    if (!this.#oauthToken) {
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
        .setOAuthToken(this.#oauthToken!)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setDeveloperKey(GoogleDriveProvider.developerKey)
        .setCallback(this.#pickerCallback)
        .build();
    picker.setVisible(true);
    return Promise.resolve();
  }

  #authorizePromiseResolve?: (accessToken: string) => void;
  #authorizePromiseReject?: (reason: string) => void;

  #handleAuthResult = (authResult: GoogleApiOAuth2TokenObject): void => {
    if (authResult.error) {
      this.#authorizePromiseReject!(authResult.error);
    } else {
      this.#authorizePromiseResolve!(authResult.access_token);
    }
  };

  async login(): Promise<void> {
    await authLoad;
    store.dispatch(loadScreenAction.start());
    gapi.auth.authorize(
      {
        'client_id': GoogleDriveProvider.clientId,
        'scope': GoogleDriveProvider.scope,
        'immediate': false
      },
      this.#handleAuthResult);
    const authorizePromise = new Promise<string>((resolve, reject) => {
      this.#authorizePromiseResolve = resolve;
      this.#authorizePromiseReject = reject;
    });
    this.#oauthToken = await authorizePromise;

    const userInfo = await gapi.client.request({
      path: `https://www.googleapis.com/oauth2/v1/userinfo`,
      method: 'GET',
    });
    const {name, email, picture, given_name: firstName, family_name: lastName} = userInfo.result;
    store.dispatch(cloudAction.setUserData({
      name,
      firstName,
      lastName,
      email,
      picture,
    }));

    store.dispatch(loadScreenAction.stop());
    return Promise.resolve();
  }

  logout(): Promise<void> {
    gapi.auth.signOut();
    return Promise.resolve();
  }

  update = async (): Promise<void> => {
    const key = store.getState().cloud.fileId;
    if (key && store.getState().cloud.provider === CloudProvider.GoogleDrive) {
      if (store.getState().cloud.provider === CloudProvider.GoogleDrive) {
        await gapi.client.request({
          path: `https://www.googleapis.com/upload/drive/v2/files/${this.#oauthToken}`,
          body: store.getState().schema.present,
          method: 'PUT',
        });
      }
    }
  }
}
