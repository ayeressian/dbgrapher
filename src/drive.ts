// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
const developerKey = 'AIzaSyC5MsNNr_aPfhg27cqAdYMcM3xzj50wE0A';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
const clientId = "742329402198-5o9j6fd5d2ah3mbuh5f4icfl9nh3vlns.apps.googleusercontent.com";

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
const appId = "742329402198";

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

// A simple callback implementation.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickerCallback(data: any): void {
  if (data.action == google.picker.Action.PICKED) {
    const file = data.docs[0];
    console.log(`https://www.googleapis.com/drive/v3/files/${file.id}`);
    fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
      mode: 'no-cors',
      headers: {
        'Authorization': 'Bearer ' + gapi.auth.getToken().access_token,
        'Access-Control-Allow-Origin': '*'
      },
    }).then(data => {
      console.log(data);
      debugger;
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
export default async function createPicker(): Promise<void> {
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
