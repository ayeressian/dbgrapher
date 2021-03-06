import store from "./store/store";
import { DbType } from "./db-grapher-schema";

const postgresql = [
  "bigint",
  "bigserial",
  "bit [ (n) ]",
  "bit varying [ (n) ]",
  "boolean",
  "box",
  "bytea",
  "character [ (n) ]",
  "character varying [ (n) ]",
  "cidr",
  "circle",
  "date",
  "double precision",
  "inet",
  "integer",
  "interval [ fields ] [ (p) ]",
  "json",
  "jsonb",
  "line",
  "lseg",
  "macaddr",
  "money",
  "numeric [ (p, s) ]",
  "path",
  "pg_lsn",
  "point",
  "polygon",
  "real",
  "smallint",
  "smallserial",
  "serial",
  "text",
  "time [ (p) ] [ without time zone ]",
  "time [ (p) ] with time zone",
  "timestamp [ (p) ] [ without time zone ]",
  "timestamp [ (p) ] with time zone",
  "tsquery",
  "tsvector",
  "txid_snapshot",
  "uuid",
  "xml",
  ////
  "int8",
  "serial8",
  "varbit [ (n) ]",
  "bool",
  "char [ (n) ]",
  "varchar [ (n) ]",
  "float8",
  "int",
  "int4",
  "decimal [ (p, s) ]",
  "float4",
  "int2",
  "serial2",
  "serial4",
  "timetz",
  "timestamptz",
];

const mysql = [
  "TINYINT",
  "SMALLINT",
  "MEDIUMINT",
  "INT",
  "BIGINT",
  "DECIMAL",
  "FLOAT",
  "DOUBLE",
  "BIT",
  "CHAR",
  "VARCHAR",
  "BINARY",
  "VARBINARY",
  "TINYBLOB",
  "BLOB",
  "MEDIUMBLOB",
  "LONGBLOB",
  "TINYTEXT",
  "TEXT",
  "MEDIUMTEXT",
  "LONGTEXT",
  "ENUM",
  "SET",
  "DATE",
  "TIME",
  "DATETIME",
  "TIMESTAMP",
  "YEAR",
  "GEOMETRY",
  "POINT",
  "LINESTRING",
  "POLYGON",
  "GEOMETRYCOLLECTION",
  "MULTILINESTRING",
  "MULTIPOINT",
  "MULTIPOLYGON",
  "JSON",
];

const sqlite = [
  "INT",
  "INTEGER",
  "TINYINT",
  "SMALLINT",
  "MEDIUMINT",
  "BIGINT",
  "UNSIGNED BIG INT",
  "INT2",
  "INT8",
  "CHARACTER(20)",
  "VARCHAR(255)",
  "VARYING CHARACTER(255)",
  "NCHAR(55)",
  "NATIVE CHARACTER(70)",
  "NVARCHAR(100)",
  "TEXT",
  "CLOB",
  "BLOB",
  "REAL",
  "DOUBLE",
  "DOUBLE PRECISION",
  "FLOAT",
  "NUMERIC",
  "DECIMAL(10,5)",
  "BOOLEAN",
  "DATE",
  "DATETIME",
];

const mssql = [
  "bigint",
  "numeric",
  "bit",
  "smallint",
  "decimal",
  "smallmoney",
  "int",
  "tinyint",
  "money",
  "float",
  "real",
  "date",
  "datetimeoffset",
  "datetime2",
  "smalldatetime",
  "datetime",
  "time",
  "char",
  "varchar",
  "text",
  "nchar",
  "nvarchar",
  "ntext",
  "binary",
  "varbinary",
  "image",
  "cursor",
  "rowversion",
  "hierarchyid",
  "uniqueidentifier",
  "sql_variant",
  "xml",
  "table",
  "geometry",
  "geography",
];

// This are ANSI SQL types
const generic = [
  "CHARACTER",
  "VARCHAR",
  "NCHAR",
  "NCHAR VARYING",
  "BINARY",
  "BINARY VARYING",
  "BINARY LARGE OBJECT",
  "NUMERIC",
  "DECIMAL",
  "SMALLINT",
  "INTEGER",
  "BIGINT",
  "FLOAT",
  "REAL",
  "DOUBLE PRECISION",
  "BOOLEAN",
  "DATE",
  "TIME",
  "TIMESTAMP",
  "INTERVAL",
];

const getDbTypes = (): string[] => {
  const type = store.getState().schema.present.dbGrapher.type;
  switch (type) {
    case DbType.Mssql:
      return mssql;
    case DbType.Mysql:
      return mysql;
    case DbType.Postgresql:
      return postgresql;
    case DbType.Sqlite:
      return sqlite;
    default:
      return generic;
  }
};

export default getDbTypes;
