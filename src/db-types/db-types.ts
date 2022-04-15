import store from "../store/store";
import { DbType } from "../db-grapher-schema";
import mssql from "./mssql-types";
import mysql from "./mysql-types";
import postgresql from "./postgresql-types";
import sqlite from "./sqlite-types";
import generic from "./generic-types";

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
