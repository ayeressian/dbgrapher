import env from '../../env.json';

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
    success: (files: any): void => {
      console.log(files);
    }
  };
  OneDrive.open(options);
}