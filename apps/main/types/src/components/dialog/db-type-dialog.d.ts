import { TemplateResult } from "lit";
import { DBGElement } from "../dbg-element";
export default class extends DBGElement {
    #private;
    private open;
    private selectedDbType;
    connectedCallback(): void;
    render(): TemplateResult;
}
