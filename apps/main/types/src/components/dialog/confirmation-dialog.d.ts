import { CSSResultGroup, TemplateResult } from "lit";
import { DBGElement } from "../dbg-element";
export default class ConfirmationDialog extends DBGElement {
    #private;
    private static instance;
    private static resultResolve;
    private static result?;
    open: boolean;
    message: string;
    confirmText: string;
    cancelText: string;
    static get styles(): CSSResultGroup;
    render(): TemplateResult;
    constructor();
    static confirm(message: string, confirmText?: string, cancelText?: string): Promise<boolean>;
}
