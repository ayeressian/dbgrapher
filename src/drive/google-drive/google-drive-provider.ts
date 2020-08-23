import store from "../../store/store";
import { actions as schemaAction } from "../../store/slices/schema";
import { actions as setSchemaAction } from "../../store/slices/load-schema";
import env from "../../../env.json";
import { actions as loadScreenAction } from "../../store/slices/load-screen";
import { actions as newOpenDialogActions } from "../../store/slices/dialog/new-open-dialog";
import {
  actions as cloudActions,
  CloudUpdateState,
} from "../../store/slices/cloud";
import DriveProvider from "../drive-provider";
import { Schema } from "db-viewer-component";
import ConfirmationDialog from "../../components/confirmation-dialog";
import ResetStoreException from "../../reset-exception";
import { wait } from "../../util";
import { validateJson } from "../../validate-schema";
import { t } from "../../localization";

const auth2Load = new Promise((resolve, reject) => {
  gapi.load("auth2", { callback: resolve, onerror: reject });
});

const pickerLoad = new Promise((resolve, reject) => {
  gapi.load("picker", { callback: resolve, onerror: reject });
});

let clientDriveLoad: Promise<void>;

const clientLoad = new Promise((resolve, reject) => {
  clientDriveLoad = new Promise((driveResolve) => {
    gapi.load("client", {
      callback: () => {
        void gapi.client.load("drive", "v3").then(driveResolve);
        resolve();
      },
      onerror: reject,
    });
  });
});

export default class GoogleDriveProvider implements DriveProvider {
  // The Browser API key obtained from the Google API Console.
  // Replace with your own Browser API key, or your own key.
  static developerKey: string = env.googleDrive.developerKey;
  // The Client ID obtained from the Google API Console. Replace with your own Client ID.
  static clientId: string = env.googleDrive.clientId;
  // Replace with your own project number from console.developers.google.com.
  // See "Project number" under "IAM & Admin" > "Settings"
  static appId: string = env.googleDrive.appId;

  // Scope to use to access user's Drive items.
  static scope =
    "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install";

  #initPromise: Promise<void>;
  #fileId!: string;
  #pickerPromise!: Promise<void>;
  #pickerPromiseResolve!: () => void;

  constructor() {
    this.#initPromise = clientLoad.then(() => {
      return gapi.client.init({
        apiKey: GoogleDriveProvider.developerKey,
        clientId: GoogleDriveProvider.clientId,
        scope: GoogleDriveProvider.scope,
      });
    });
  }

  async open(fileId: string, fileName?: string): Promise<void> {
    await this.login();
    await clientDriveLoad;
    if (fileName == null) {
      const file = await gapi.client.drive.files.get({
        fileId,
      });
      fileName = file.result.name!;
    }
    const filesContent = await gapi.client.drive.files.get({
      fileId: fileId,
      alt: "media",
    });
    const jsonValidation = validateJson(filesContent.result as Schema);
    if (!jsonValidation) {
      alert(t((l) => l.error.invalidFileFormat));
    } else {
      store.dispatch(cloudActions.setFileName(fileName));
      store.dispatch(cloudActions.setUpdateState(CloudUpdateState.Saved));
      store.dispatch(
        schemaAction.initiate((filesContent.result as unknown) as Schema)
      );
      store.dispatch(setSchemaAction.load());
      store.dispatch(newOpenDialogActions.close());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  #pickerCallback = async (data: any): Promise<void> => {
    if (data.action == google.picker.Action.PICKED) {
      store.dispatch(loadScreenAction.start());
      const file = data.docs[0];
      this.#fileId = file.id;
      await this.open(file.id, file.name);
    }
    if (
      [google.picker.Action.PICKED, google.picker.Action.CANCEL].includes(
        data.action
      )
    ) {
      this.#pickerPromiseResolve();
    }
  };

  async picker(): Promise<void> {
    await this.login();
    store.dispatch(loadScreenAction.start());

    this.#pickerPromise = new Promise(
      (resolve) => (this.#pickerPromiseResolve = resolve)
    );
    await pickerLoad;
    const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
    view.setMimeTypes("application/JSON");
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setAppId(GoogleDriveProvider.appId)
      .setOAuthToken(
        gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
          .access_token
      )
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
    await auth2Load;
    await this.#initPromise;
    let user;
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      user = gapi.auth2.getAuthInstance().currentUser.get();
    } else {
      store.dispatch(loadScreenAction.start());
      try {
        user = await gapi.auth2.getAuthInstance().signIn();
      } catch (error) {
        switch (error.error) {
          case "popup_closed_by_user":
            return false;
          case "popup_blocked_by_browser":
            store.dispatch(loadScreenAction.stop());
            if (
              await ConfirmationDialog.confirm(
                t((l) => l.confirmation.signin.text),
                t((l) => l.confirmation.signin.confirm)
              )
            ) {
              return await this.login();
            }
            throw new ResetStoreException();
        }
        throw error;
      } finally {
        store.dispatch(loadScreenAction.stop());
      }
    }
    if (user.getId() !== store.getState().cloud.userData?.id) {
      const profile = user.getBasicProfile();
      store.dispatch(
        cloudActions.setUserData({
          id: user.getId(),
          name: profile.getName(),
          firstName: profile.getGivenName(),
          lastName: profile.getFamilyName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl(),
        })
      );
    }
    return true;
  }

  async logout(): Promise<never> {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    authInstance.disconnect();
    throw new ResetStoreException();
  }

  async updateFile(isRetry = false): Promise<void> {
    await this.login();
    if (!isRetry)
      store.dispatch(cloudActions.setUpdateState(CloudUpdateState.Saving));
    if (this.#fileId == null) {
      await this.createFile();
    }
    try {
      await gapi.client.request({
        path: `https://www.googleapis.com/upload/drive/v2/files/${
          this.#fileId
        }`,
        body: store.getState().schema.present,
        method: "PUT",
      });
    } catch (err) {
      //network error
      if (err?.result?.error?.code === -1) {
        store.dispatch(
          cloudActions.setUpdateState(CloudUpdateState.NetworkError)
        );
        await wait(2000);
        await this.updateFile(true);
        return;
      }
      throw err;
    }
    store.dispatch(cloudActions.setUpdateState(CloudUpdateState.Saved));
  }

  async createFile(folderId?: string): Promise<void> {
    await this.login();
    const fileName = store.getState().cloud.fileName!;
    await clientDriveLoad;
    const resource = {
      name: fileName,
      mimeType: "application/json",
    } as gapi.client.drive.File;
    if (folderId) resource.parents = [folderId];
    const file = await gapi.client.drive.files.create({
      resource,
    });
    this.#fileId = file.result.id!;
  }

  async renameFile(newFileName: string): Promise<void> {
    if (this.#fileId) {
      await this.login();
      await clientDriveLoad;
      try {
        await gapi.client.drive.files.update({
          fileId: this.#fileId,
          resource: {
            name: newFileName,
          },
        });
      } catch (err) {
        //network error
        if (err.result.error.code === -1) {
          store.dispatch(
            cloudActions.setUpdateState(CloudUpdateState.NetworkError)
          );
          await wait(2000);
          await this.renameFile(newFileName);
          return;
        }
        throw err;
      }
    }
    store.dispatch(cloudActions.setUpdateState(CloudUpdateState.Saved));
    store.dispatch(cloudActions.setFileName(newFileName));
  }
}
