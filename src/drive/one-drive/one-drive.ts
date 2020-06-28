import env from '../../../env.json';
import store from '../../store/store';
import { actions as schemaAction } from '../../store/slices/schema';
import { actions as setSchemaAction } from '../../store/slices/load-schema';
import { actions as fileOpenChooserAction } from "../../store/slices/dialog/file-open-chooser-dialog";
import { actions as loadScreenAction } from '../../store/slices/load-screen';
import { PublicClientApplication, AuthenticationResult } from "@azure/msal-browser";
import SimpleAuthProvider from './SimpleAuthProvider';
import { AuthenticationHandler, HTTPMessageHandler, Client } from '@microsoft/microsoft-graph-client';
import CustomLoggingHandler from './CustomLoggingHandler';
import { actions as cloudAction } from '../../store/slices/cloud';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Options = {
  clientId: string;
  action?: string;
  multiSelect?: boolean;
  advanced?: any;
  success?: (files: any) => void;
  cancel?: () => void;
  error?: (error: any) => void;
};

type OneDrive = {
  open: (options: Options) => void;
};

declare global {
  const OneDrive: OneDrive;
}

let authenticationResult: AuthenticationResult;

export const login = async (): Promise<void> => {
  store.dispatch(loadScreenAction.start());
  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: env.oneDrive.clientId,
      authority: "https://login.microsoftonline.com/common",
    },
    cache: {
      cacheLocation: "sessionStorage",
    }
  });
  authenticationResult = await msalInstance.loginPopup({
    scopes: ['openid', 'User.Read', 'Files.ReadWrite'],
    redirectUri: '',
  });

  // Create a custom auth provider
  const authProvider = new SimpleAuthProvider(authenticationResult.accessToken);
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
    defaultVersion: 'v1.0',
    debugLogging: true,
    middleware: authHandler,
  });

  const response = await client
    .api('/me')
    .get();

  store.dispatch(cloudAction.oneDrive({
    name: response.displayName,
    email: response.userPrincipalName
  }));

  store.dispatch(loadScreenAction.stop());
};

export function picker(): void {
  const options = {
    clientId: env.oneDrive.clientId,
    action: 'download',
    success: (files: any): void => {
      const file = files.value[0];
      fetch(file['@microsoft.graph.downloadUrl']).then((result) => {
        return result.json();
      }).then(result => {
        store.dispatch(schemaAction.initiate(result));
        store.dispatch(fileOpenChooserAction.close());
        store.dispatch(setSchemaAction.load());
        store.dispatch(loadScreenAction.stop());
      });
    },
    cancel: (): void => {
      store.dispatch(loadScreenAction.stop());
    }, 
    error: (error: any): void => {
      console.error(error);
      store.dispatch(loadScreenAction.stop());
    },
    advanced: {
      accessToken: authenticationResult.accessToken
    }
  };
  store.dispatch(loadScreenAction.start());
  OneDrive.open(options);
}