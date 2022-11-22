import { TemplateResult, CSSResultGroup } from "lit";
import { DBGElement } from "../dbg-element";
export default class extends DBGElement {
    #private;
    private openAccountPopup;
    private openFileRenamePopup;
    private fileName;
    private cloudState;
    static get styles(): CSSResultGroup;
    render(): TemplateResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
}
