declare module 'onedrive-auth' {
  type options = {
    clientId: string;
    scopes: string;
    redirectUri: string;
  };

  export default class OneDriveAuth {
    constructor(option: options);

    auth(): Promise<string>;
  }
}
