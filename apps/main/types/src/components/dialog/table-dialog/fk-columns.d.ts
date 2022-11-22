import { TemplateResult, CSSResultGroup } from "lit";
import { ColumnFkSchema, Schema } from "db-viewer";
import { DBGElement } from "../../dbg-element";
export interface FkColumnChangeEventDetail {
    column: ColumnFkSchema;
    index: number;
    prevName: string;
}
export default class TableDialogFkColumns extends DBGElement {
    #private;
    schema: Schema;
    tableIndex: number;
    static get styles(): CSSResultGroup;
    firstUpdated(): void;
    validateColumnNames: () => void;
    reportValidity(): boolean;
    render(): TemplateResult;
}
