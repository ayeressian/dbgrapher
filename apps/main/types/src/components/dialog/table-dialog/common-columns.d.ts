import { ColumnSchema } from "db-viewer";
import TableDialogColumns from "./columns";
import TableDialogFkColumns from "./fk-columns";
export declare const styles: import("lit").CSSResult;
export interface ColumnOpsDetail {
    index: number;
}
export declare type ColumnOpsEvent = CustomEvent<ColumnOpsDetail>;
export interface ColumnChangeEventDetail {
    column: ColumnSchema;
    index: number;
    prevName: string;
}
export declare type ColumnChangeEvent = CustomEvent<ColumnChangeEventDetail>;
export declare function removeColumn(this: TableDialogColumns | TableDialogFkColumns, index: number): void;
export declare function moveUpColumn(this: TableDialogColumns | TableDialogFkColumns, index: number, indexByType: number): void;
export declare function moveDownColumn(this: TableDialogColumns | TableDialogFkColumns, index: number, indexByType: number, lengthByType: number): void;
