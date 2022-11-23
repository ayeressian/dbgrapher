import { t } from "../../localization";
import { localDrive } from "../operations";

export interface Item {
  id: string;
  title: string;
  items?: Item[];
}

export interface TopMenuConfig {
  items: Item[];
}

const getConfig = (): TopMenuConfig => {
  const config = {
    items: [
      {
        id: "file",
        title: t((l) => l.topMenu.items.file.file),
        items: [
          {
            id: "new",
            title: t((l) => l.topMenu.items.file.new),
          },
          {
            id: "open",
            title: t((l) => l.topMenu.items.file.open),
          },
          {
            id: "downloadSchema",
            title: t((l) => l.topMenu.items.file.download),
          },
          {
            id: "exportSql",
            title: t((l) => l.topMenu.items.file.exportSql),
          },
        ],
      },
      {
        id: "edit",
        title: t((l) => l.topMenu.items.edit.edit),
        items: [
          {
            id: "undo",
            title: t((l) => l.topMenu.items.edit.undo),
          },
          {
            id: "redo",
            title: t((l) => l.topMenu.items.edit.redo),
          },
          {
            id: "selectDbType",
            title: t((l) => l.topMenu.items.edit.selectDbType),
          },
        ],
      },
      {
        id: "help",
        title: t((l) => l.topMenu.items.help.help),
        items: [
          {
            id: "reportIssue",
            title: t((l) => l.topMenu.items.help.reportIssue),
          },
          {
            id: "termsOfService",
            title: t((l) => l.topMenu.items.help.termsOfService),
          },
          {
            id: "privacyPolicy",
            title: t((l) => l.topMenu.items.help.privacyPolicy),
          },
          {
            id: "about",
            title: t((l) => l.topMenu.items.help.about),
          },
        ],
      },
      {
        id: "gitHub",
        title: t((l) => l.topMenu.items.gitHub),
      },
    ],
  } as TopMenuConfig;

  if (window.showOpenFilePicker != null && localDrive()) {
    config.items[0].items?.splice(2, 0, {
      id: "save",
      title: t((l) => l.topMenu.items.file.save),
    });
    config.items[0].items?.splice(3, 0, {
      id: "saveAs",
      title: t((l) => l.topMenu.items.file.saveAs),
    });
  }
  return config;
};

export default getConfig;
