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

export {};
