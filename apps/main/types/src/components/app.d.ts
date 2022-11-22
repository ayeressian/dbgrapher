import "../localization";
import "./import-components";
import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "./dbg-element";
export default class extends DBGElement {
    #private;
    static get styles(): CSSResultGroup;
    render(): TemplateResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
