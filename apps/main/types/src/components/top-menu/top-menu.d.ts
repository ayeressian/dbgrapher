import { CSSResultGroup, TemplateResult } from "lit";
import { TopMenuConfig } from "./top-menu-config";
import { DBGElement } from "../dbg-element";
export default class extends DBGElement {
    #private;
    static get styles(): CSSResultGroup;
    config?: TopMenuConfig;
    private dropdownItems?;
    private dropdownStyle;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
