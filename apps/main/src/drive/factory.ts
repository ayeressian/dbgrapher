import DriveProvider from "./drive-provider";
import { subscribe } from "../subscribe-store";
import LocalProvider from "./none/local-provider";

let driveProvider = new LocalProvider();

export const getDriveProvider = (): DriveProvider => driveProvider;

const initFactory = (): void => {
  subscribe(
    (state) => state.cloud.provider,
    (provider) => {
      switch (provider) {
        default:
          driveProvider = new LocalProvider();
          break;
      }
    }
  );
};

export default initFactory;
