import { Schema } from "db-viewer-component";

export enum DbType {
  Postgresql = "Postgresql",
  Mysql = "Mysql",
  Sqlite = "Sqlite",
  Mssql = "Mssql",
  Generic = "Generic",
}

interface DbGrapher {
  type: DbType;
}

interface DbGrapherSchema extends Schema {
  dbGrapher: DbGrapher;
}

export default DbGrapherSchema;
