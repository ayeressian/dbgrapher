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

let pickerApiLoaded = false;
let oauthToken: string;

// A simple callback implementation.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickerCallback(data: any): void {
  if (data.action == google.picker.Action.PICKED) {
    const fileId = data.docs[0].id;
    alert('The user selected: ' + fileId);
  }
}

// Create and render a Picker object for searching images.
function createPicker(): void {
  if (pickerApiLoaded && oauthToken) {
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

function onPickerApiLoad(): void {
  pickerApiLoaded = true;
  createPicker();
}

function handleAuthResult(authResult: GoogleApiOAuth2TokenObject): void {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker();
  }
}

function onAuthApiLoad(): void {
  window.gapi.auth.authorize(
      {
        'client_id': clientId,
        'scope': scope,
        'immediate': false
      },
      handleAuthResult);
}

// Use the Google API Loader script to load the google.picker script.
export default function loadPicker(): void {
  gapi.load('auth', {'callback': onAuthApiLoad});
  gapi.load('picker', {'callback': onPickerApiLoad});
}