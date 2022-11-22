import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "./dbg-element";
export default class extends DBGElement {
    #private;
    static get styles(): CSSResultGroup;
    private mode;
    render(): TemplateResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
