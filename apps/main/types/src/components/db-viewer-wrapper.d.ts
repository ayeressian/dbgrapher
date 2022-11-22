import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "./dbg-element";
export default class DbWrapper extends DBGElement {
    #private;
    static get styles(): CSSResultGroup;
    firstUpdated(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
