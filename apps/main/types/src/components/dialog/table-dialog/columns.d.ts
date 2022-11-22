import { TemplateResult, CSSResultGroup } from "lit";
import { Schema } from "db-viewer";
import { DBGElement } from "../../dbg-element";
export default class TableDialogColumns extends DBGElement {
    #private;
    schema: Schema;
    tableIndex: number;
    static get styles(): CSSResultGroup;
    validateColumnNames: () => void;
    firstUpdated(): void;
    reportValidity(): boolean;
    render(): TemplateResult;
}
