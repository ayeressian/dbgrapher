import { TemplateResult, CSSResultGroup } from "lit";
import { CloudState } from "../../store/slices/cloud";
import { DBGElement } from "../dbg-element";
export default class extends DBGElement {
    #private;
    cloudState: CloudState;
    static get styles(): CSSResultGroup;
    render(): TemplateResult;
}
