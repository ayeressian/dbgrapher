export default {
  error: {
    invalidFileFormat:
      "Selected file does not have correct DB grapher file format",
    invalidJSON: "Selected file does not contain valid JSON.",
    emptySchemaDownload:
      "Schema is empty. Please create tables and relations first.",
  },
  confirmation: {
    signin: {
      text: "Sign in is required to continue.",
      confirm: "Login",
    },
    cyclicError: {
      text:
        "There is a cyclic relationship chain in your schema. Using generated SQL file with the RDBMS might cause error.",
      confirm: "Continue",
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
      title: "Please select a cloud provider.",
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
    table: {
      warningRecursive:
        "Removing this column will result in recursive deletion of the following columns in tables that have fk constraint to this column.\n $tableColumn",
      errorSameNameTable: "There is already a table with the name $name.",
      labelName: "Name",
      saveBtn: "Save",
      cancelBtn: "Cancel",
      duplicateNameError: 'There is already a column with the name "$name".',
      nameError: "This field is required and should have the following format.",
    },
    dbType: {
      mssql: "Microsoft SQL Server",
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      sqlite: "SQLite",
      generic: "Generic",
      title: "Please select the database type",
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
    save: "File saved successfully",
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
    items: {
      file: {
        file: "File",
        new: "New",
        open: "Open",
        exportSql: "Export SQL",
        download: "Download",
        save: "Save",
        saveAs: "Save as",
      },
      edit: {
        edit: "Edit",
        undo: "Undo",
        redo: "Redo",
        selectDbType: "Select DB type",
        increaseViewSize: "Increase view size",
        decreaseViewSize: "Decrease view size",
      },
      help: {
        help: "Help",
        reportIssue: "Report an issue",
        about: "About",
        privacyPolicy: "Privacy policy",
        termsOfService: "Terms of service",
      },
      gitHub: "GitHub",
    },
  },
  cloudProvider: {
    googleDrive: "Google Drive",
    oneDrive: "OneDrive",
  },
};
