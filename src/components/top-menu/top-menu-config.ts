import { t } from "../../localization";

export interface Item {
  id: string;
  title: string;
  items?: Item[];
}

export interface TopMenuConfig {
  items: Item[];
}

export default {
  items: [
    {
      id: "file",
      title: "File",
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
          id: "exportSql",
          title: t((l) => l.topMenu.items.file.exportSql),
        },
        {
          id: "downloadSchema",
          title: t((l) => l.topMenu.items.file.download),
        },
      ],
    },
    {
      id: "edit",
      title: "Edit",
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
      title: "Help",
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
