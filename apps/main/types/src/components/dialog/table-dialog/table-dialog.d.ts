import { CSSResultGroup, TemplateResult, PropertyValues } from "lit";
import { DBGElement } from "../../dbg-element";
export default class extends DBGElement {
    #private;
    private open;
    private schema;
    static get styles(): CSSResultGroup;
    update(changedProperties: PropertyValues): Promise<void>;
    connectedCallback(): void;
    render(): TemplateResult;
}
