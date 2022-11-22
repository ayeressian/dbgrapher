import en from "./local/local-en";
declare type Localization = typeof en;
export declare function t(path: (l: Localization) => string, replaceTexts?: Record<string, string>): string;
export declare function t(path: (l: Localization) => string, replaceTexts?: string, ...replaceTextsRest: string[]): string;
export {};
