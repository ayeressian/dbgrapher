import env from '../../env.json';
import store from '../store/store';
import { actions as schemaAction } from '../store/slices/schema';
import { actions as setSchemaAction } from '../store/slices/load-schema';
import { actions as fileOpenChooserAction } from "../store/slices/file-open-chooser-dialog";
import { actions as loadScreenAction } from '../store/slices/load-screen';

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
    }
  };
  store.dispatch(loadScreenAction.start());
  OneDrive.open(options);
}