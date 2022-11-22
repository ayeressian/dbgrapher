import { Schema } from "db-viewer";
export declare const validateColumnNames: (shadowRoot: ShadowRoot, schema: Schema, tableIndex: number, fkOffset?: number) => void;
export declare const validateColumnNamesFromFk: (shadowRoot: ShadowRoot, schema: Schema, tableIndex: number) => void;
