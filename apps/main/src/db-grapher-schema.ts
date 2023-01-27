import { Schema } from "db-viewer";

export type DbType =
  | "Postgresql"
  | "Mysql"
  | "Sqlite"
  | "Mssql"
  | "Generic"
  | "NotSelected";

interface DbGrapher {
  type: DbType;
}

interface DbGrapherSchema extends Schema {
  dbGrapher: DbGrapher;
}

export default DbGrapherSchema;
