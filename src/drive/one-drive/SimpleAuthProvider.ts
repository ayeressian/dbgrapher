import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";

export default class SimpleAuthProvider implements AuthenticationProvider {
  #accessToken: string;

  constructor(accessToken: string) {
    this.#accessToken = accessToken;
  }

  getAccessToken = (): Promise<string> => {
    return Promise.resolve(this.#accessToken);
  };
}
