import env from "../../../env.json";
import store from "../../store/store";
import { actions as schemaAction } from "../../store/slices/schema";
import { actions as setSchemaAction } from "../../store/slices/load-schema";
import { actions as fileOpenChooserAction } from "../../store/slices/dialog/file-open-chooser-dialog";
import { actions as loadScreenAction } from "../../store/slices/load-screen";
import {
  PublicClientApplication,
  AuthenticationResult,
} from "@azure/msal-browser";
import SimpleAuthProvider from "./SimpleAuthProvider";
import {
  AuthenticationHandler,
  HTTPMessageHandler,
  Client,
} from "@microsoft/microsoft-graph-client";
import CustomLoggingHandler from "./CustomLoggingHandler";
import { actions as cloudAction } from "../../store/slices/cloud";
import DriveProvider from "../drive-provider";

export default class OneDriveProvider implements DriveProvider {
  #authenticationResult!: AuthenticationResult;
  #msalInstance!: PublicClientApplication;

  picker(): Promise<void> {
    const options = {
      clientId: env.oneDrive.clientId,
      action: "download",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (files: any): void => {
        const file = files.value[0];
        fetch(file["@microsoft.graph.downloadUrl"])
          .then((result) => {
            return result.json();
          })
          .then((result) => {
            store.dispatch(schemaAction.initiate(result));
            store.dispatch(fileOpenChooserAction.close());
            store.dispatch(setSchemaAction.load());
            store.dispatch(loadScreenAction.stop());
          });
      },
      cancel: (): void => {
        store.dispatch(loadScreenAction.stop());
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (error: any): void => {
        console.error(error);
        store.dispatch(loadScreenAction.stop());
      },
      advanced: {
        accessToken: this.#authenticationResult.accessToken,
        endpointHint: "api.onedrive.com",
        redirectUri: "http://localhost:9999",
      },
    };
    store.dispatch(loadScreenAction.start());
    OneDrive.open(options);
    return Promise.resolve();
  }

  logout = async (): Promise<void> => {
    store.dispatch(loadScreenAction.start());
    await this.#msalInstance.logout();
    store.dispatch(loadScreenAction.stop());
  };

  login = async (): Promise<boolean> => {
    store.dispatch(loadScreenAction.start());
    this.#msalInstance = new PublicClientApplication({
      auth: {
        clientId: env.oneDrive.clientId,
        authority: "https://login.microsoftonline.com/common",
      },
      cache: {
        cacheLocation: "sessionStorage",
      },
    });
    this.#authenticationResult = await this.#msalInstance.loginPopup({
      scopes: ["openid", "User.Read", "Files.ReadWrite.All"],
      redirectUri: "",
    });

    // Create a custom auth provider
    const authProvider = new SimpleAuthProvider(
      this.#authenticationResult.accessToken
    );
    // Create an authentication handler that uses custom auth provider
    const authHandler = new AuthenticationHandler(authProvider);

    // Create a custom logging handler
    const loggingHandler = new CustomLoggingHandler();

    // Create a standard HTTP message handler
    const httpHandler = new HTTPMessageHandler();

    // Use setNext to chain handlers together
    // auth -> logging -> http
    authHandler.setNext(loggingHandler);
    loggingHandler.setNext(httpHandler);

    // Pass the first middleware in the chain in the middleWare property
    const client = Client.initWithMiddleware({
      defaultVersion: "v1.0",
      debugLogging: true,
      middleware: authHandler,
    });

    const response = await client.api("/me").get();

    let picture;
    try {
      const photoResponse = await client.api("/me/photo").get();
      picture = photoResponse["@odata.id"];
    } catch (e) {
      if (e.statusCode !== 404) {
        throw e;
      }
    }

    store.dispatch(
      cloudAction.setUserData({
        id: response.id,
        name: response.displayName,
        firstName: response.givenName,
        lastName: response.surname,
        email: response.userPrincipalName,
        picture,
      })
    );

    store.dispatch(loadScreenAction.stop());
    return true;
  };

  updateFile(): Promise<void> {
    //TODO
    return Promise.resolve();
  }

  createFile(): Promise<void> {
    //TODO
    return Promise.resolve();
  }

  renameFile(): Promise<void> {
    //TODO
    return Promise.resolve();
  }

  open(): Promise<void> {
    //TODO
    return Promise.resolve();
  }
}
