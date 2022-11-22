import { Action } from "redux";
declare const appReducer: import("redux").Reducer<import("redux").CombinedState<{
    createCords: import("db-viewer").Point | null;
    dbViewerMode: import("./slices/db-viewer-mode-type").default;
    cloud: import("./slices/cloud").CloudState;
    hint: import("./slices/hint").Hint[];
    dialog: import("redux").CombinedState<{
        dialogs: {
            aboutDialog: boolean;
            newOpenDialog: boolean;
            cloudProviderChooserDialog: boolean;
        };
        dbTypeDialog: import("./slices/dialog/db-type-dialog").DbTypeDialogState;
        fileDialog: import("./slices/dialog/file-dialog").FileDialogState;
        tableDialog: {
            open: boolean;
            tableName?: string | undefined;
            cords?: import("db-viewer").Point | undefined;
        };
        fileOpenChooserDialog: import("./slices/dialog/file-open-chooser-dialog").FileOpenDialogState;
    }>;
    loadScreen: boolean;
    loadSchema: import("./slices/load-schema").State;
    schema: {
        past: import("../db-grapher-schema").default[];
        present: import("../db-grapher-schema").default;
        future: import("../db-grapher-schema").default[];
    };
    localization: import("./slices/localization").LocalizationState;
    showUnsavedWarning: boolean;
}>, import("redux").AnyAction>;
export declare type AppState = ReturnType<typeof appReducer>;
declare const rootReducer: (state: unknown, action: Action) => AppState;
export default rootReducer;
