import store from "../store/store";
import mssql from "./mssql-types";
import mysql from "./mysql-types";
import postgresql from "./postgresql-types";
import sqlite from "./sqlite-types";
import generic from "./generic-types";

const getDbTypes = (): string[] => {
  const type = store.getState().schema.present.dbGrapher.type;
  switch (type) {
    case "Mssql":
      return mssql;
    case "Mysql":
      return mysql;
    case "Postgresql":
      return postgresql;
    case "Sqlite":
      return sqlite;
    default:
      return generic;
  }
};

export default getDbTypes;
