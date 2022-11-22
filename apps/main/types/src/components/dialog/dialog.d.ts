import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "../dbg-element";
export declare type OnCloseEvent = CustomEvent;
export default class extends DBGElement {
    #private;
    show: boolean;
    showBack: boolean;
    showClose: boolean;
    centerTitle: string;
    static get styles(): CSSResultGroup;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}
