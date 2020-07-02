import store from '../../store/store';
import { actions as schemaAction } from '../../store/slices/schema';
import { actions as setSchemaAction } from '../../store/slices/load-schema';
import { actions as cloudActions } from '../../store/slices/cloud';
import { actions as fileOpenChooserAction } from "../../store/slices/dialog/file-open-chooser-dialog";
import env from '../../../env.json';
import { actions as loadScreenAction } from '../../store/slices/load-screen';
import { CloudProvider, actions as cloudAction } from '../../store/slices/cloud';

const {
  // The Browser API key obtained from the Google API Console.
  // Replace with your own Browser API key, or your own key.
  developerKey,
  // The Client ID obtained from the Google API Console. Replace with your own Client ID.
  clientId,
  // Replace with your own project number from console.developers.google.com.
  // See "Project number" under "IAM & Admin" > "Settings"
  appId
} = env.googleDrive;

// Scope to use to access user's Drive items.
const scope = ['https://www.googleapis.com/auth/drive.file'];

let authorizePromiseResolve: (accessToken: string) => void;
let authorizePromiseReject: (reason: string) => void;
const authorizePromise = new Promise<string>((resolve, reject) => {
  authorizePromiseResolve = resolve;
  authorizePromiseReject = reject;
});

const handleAuthResult = (authResult: GoogleApiOAuth2TokenObject): void => {
  if (authResult.error) {
    authorizePromiseReject(authResult.error);
  } else {
    authorizePromiseResolve(authResult.access_token);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pickerCallback = (data: any): void => {
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

const authLoad = new Promise((resolve) => {
  gapi.load('auth', {'callback': resolve});  
});

const pickerLoad = new Promise((resolve) => {
  gapi.load('picker', {'callback': resolve});
});

let oauthToken: string;

export const login = async (): Promise<void> => {
  await authLoad;
  store.dispatch(loadScreenAction.start());
  gapi.auth.authorize(
    {
      'client_id': clientId,
      'scope': scope,
      'immediate': false
    },
    handleAuthResult);
  oauthToken = await authorizePromise;

  const userInfo = await gapi.client.request({
    path: `https://www.googleapis.com/oauth2/v1/userinfo`,
    method: 'GET',
  });
  const {name, email, picture, given_name: firstName, family_name: lastName} = userInfo.result;
  store.dispatch(cloudAction.googleDrive({
    name,
    firstName,
    lastName,
    email,
    picture,
  }));

  store.dispatch(loadScreenAction.stop());
};

// Create and render a Picker object for searching images.
export const picker = async (): Promise<void> => {
  if (!oauthToken) {
    await login();
  }
  store.dispatch(loadScreenAction.start());
  await pickerLoad;
  const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
  view.setMimeTypes("application/JSON");
  const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(appId)
      .setOAuthToken(oauthToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setDeveloperKey(developerKey)
      .setCallback(pickerCallback)
      .build();
  picker.setVisible(true);
};

export const update = async (): Promise<void> => {
  const key = store.getState().cloud.fileId;
  if (key && store.getState().cloud.provider === CloudProvider.GoogleDrive) {
    if (store.getState().cloud.provider === CloudProvider.GoogleDrive) {
      await gapi.client.request({
        path: `https://www.googleapis.com/upload/drive/v2/files/${oauthToken}`,
        body: store.getState().schema.present,
        method: 'PUT',
      });
    }
  }
};
