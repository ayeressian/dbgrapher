import { TemplateResult, CSSResultGroup } from "lit";
import { DBGElement } from "./dbg-element";
declare type ComplexItem = {
    value: string;
    text: string;
};
declare type Option = string | ComplexItem;
declare type OnSelectEventDetail = {
    value: string;
    selectedIndex: number;
};
export declare type OnSelectEvent = CustomEvent<OnSelectEventDetail>;
export default class Select extends DBGElement {
    #private;
    options: Option[];
    value: string;
    required: boolean;
    static get styles(): CSSResultGroup;
    firstUpdated(): void;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    reportValidity: () => boolean;
    render(): TemplateResult;
}
export {};
