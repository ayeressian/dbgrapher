import { Schema } from "db-viewer";
export declare enum DbType {
    Postgresql = "Postgresql",
    Mysql = "Mysql",
    Sqlite = "Sqlite",
    Mssql = "Mssql",
    Generic = "Generic",
    NotSelected = "NotSelected"
}
interface DbGrapher {
    type: DbType;
}
interface DbGrapherSchema extends Schema {
    dbGrapher: DbGrapher;
}
export default DbGrapherSchema;
