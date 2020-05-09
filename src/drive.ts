import store from './store/store';
import { actions as schemaAction } from './store/slices/schema';
import { actions as setSchemaAction } from './store/slices/load-schema';
import { actions as googleDriveAction } from './store/slices/google-drive-key';
import env from '../env.json';

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

function handleAuthResult(authResult: GoogleApiOAuth2TokenObject): void {
  if (authResult.error) {
    authorizePromiseReject(authResult.error);
  } else {
    authorizePromiseResolve(authResult.access_token);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickerCallback(data: any): void {
  if (data.action == google.picker.Action.PICKED) {
    const file = data.docs[0];
    gapi.client.request({
      path: `https://www.googleapis.com/drive/v2/files/${file.id}`,
      params: {
        mimeType: file.mimeType
      }
    }).then((data) => {
      store.dispatch(googleDriveAction.set(file.id));
      gapi.client.request({
        path: data.result.downloadUrl
      }).then((contentData) => {
        store.dispatch(schemaAction.initiate(contentData.result));
        store.dispatch(setSchemaAction.load());
      });
    });
  }
}

const authLoad = new Promise((resolve) => {
  gapi.load('auth', {'callback': resolve});  
});

const pickerLoad = new Promise((resolve) => {
  gapi.load('picker', {'callback': resolve});
});

// Create and render a Picker object for searching images.
export async function picker(): Promise<void> {
  await authLoad;
  gapi.auth.authorize(
    {
      'client_id': clientId,
      'scope': scope,
      'immediate': false
    },
    handleAuthResult);
  const oauthToken = await authorizePromise;
  await pickerLoad;
  if (oauthToken) {
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
  }
}

export async function update(): Promise<void> {
  const key = store.getState().googleDriveKey;
  if (key) {
    await gapi.client.request({
      path: `https://www.googleapis.com/upload/drive/v2/files/${key}`,
      body: store.getState().schema.present,
      method: 'PUT',
    });
  }
}