import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "../dbg-element";
export default class extends DBGElement {
    #private;
    text: string;
    icon: string;
    selected: boolean;
    static get styles(): CSSResultGroup;
    render(): TemplateResult;
}
