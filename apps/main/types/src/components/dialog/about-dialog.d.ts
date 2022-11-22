import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "../dbg-element";
export default class extends DBGElement {
    #private;
    private open;
    static get styles(): CSSResultGroup;
    render(): TemplateResult;
    connectedCallback(): void;
}
