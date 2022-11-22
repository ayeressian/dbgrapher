import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "./dbg-element";
export default class extends DBGElement {
    private view;
    static get styles(): CSSResultGroup;
    connectedCallback(): void;
    render(): TemplateResult;
}
