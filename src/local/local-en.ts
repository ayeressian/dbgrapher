export default {
  error: {
    invalidFileFormat:
      "Selected file does not have correct DB grapher file format",
    invalidJSON: "Selected file does not contain valid JSON.",
  },
  confirmation: {
    signin: {
      text: "Sign in is required to continue.",
      confirm: "Login",
    },
  },
  dialog: {
    about: {
      footer: "I hope you enjoy using this application.",
      text: `Hello my name is Ara. Currenttly I'm the only contributer of this
        project. I initiated this project for my own needs. If you like
        relational databases and have knowledge or wish to learn more about
        typescript, webcomponent, litelement, redux, webpack, karma,
        jasmine, playwright and much more you should consider to contribute
        to this project.`,
    },
    cloudProvider: {
      title:
        "Please select a cloud provider. NOTE THIS IS THE PRE RELEASE VERSION OF THE APPLICATION.",
      operation: {
        googleDrive: "Google Drive",
        none: "None",
      },
    },
    fileOpenChooser: {
      operation: {
        myComputer: "My Computer",
        googleDrive: "Google Drive",
      },
    },
    newOpen: {
      operation: {
        newSchema: "New Schema",
        openSchema: "Open Schema",
      },
    },
  },
  hint: {
    tableCreation:
      "Choose the position of the new table by clicking on the viewport",
    relationCreation:
      "Click on the first table to create the relation from and then click on the second table to create the relation to",
    remove: "Please select on the table or relation that you want to remove",
    driveSave:
      "Changes to the file will be automatically saved to Google drive",
  },
  sidePanel: {
    createTable: "Create Table",
    createOneToManyRelation: "Create one to many relation",
    createZeroToManyRelation: "Create zero to many relation",
    createOneToOneRelation: "Create one to one relation",
    createZeroToOneRelation: "Create zero to one relation",
    removeTableOrRelation: "Remove table or relation",
  },
  topMenu: {
    accountPopup: {
      text: "You are logged in via $cloudProvider as $userIdentifier",
      logout: "Logout",
    },
    centerText: {
      networkError:
        "$fileName - Not saved to $providerName. Please check your internet connection.",
      saving: "$fileName - Saving to $providerName",
      saved: "$fileName - Saved to $providerName",
    },
  },
  cloudProvider: {
    googleDrive: "Google Drive",
    oneDrive: "OneDrive",
  },
};
