import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "./dbg-element";
export default class extends DBGElement {
    #private;
    firstUpdated(): void;
    static get styles(): CSSResultGroup;
    connectedCallback(): void;
    render(): TemplateResult;
}
