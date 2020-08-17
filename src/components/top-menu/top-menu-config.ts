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
          title: "New Schema",
        },
        {
          id: "open",
          title: "Open Schema",
        },
        {
          id: "exportSql",
          title: "Export SQL",
        },
        {
          id: "downloadSchema",
          title: "Download",
        },
      ],
    },
    {
      id: "help",
      title: "Help",
      items: [
        {
          id: "reportIssue",
          title: "Report an issue",
        },
        {
          id: "about",
          title: "About",
        },
      ],
    },
    {
      id: "gitHub",
      title: "GitHub",
    },
  ],
} as TopMenuConfig;
