import { TemplateResult, CSSResultGroup } from "lit";
import { DBGElement } from "../dbg-element";
declare type FileNameUpdateEventDetail = {
    newFileName: string;
};
export declare type FileNameUpdateEvent = CustomEvent<FileNameUpdateEventDetail>;
export default class extends DBGElement {
    #private;
    fileName: string;
    static get styles(): CSSResultGroup;
    render(): TemplateResult;
    firstUpdated(): void;
}
export {};
