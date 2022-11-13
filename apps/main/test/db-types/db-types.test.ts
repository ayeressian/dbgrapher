import mssql from "../../src/db-types/mssql-types";
import mysql from "../../src/db-types/mysql-types";
import postgresql from "../../src/db-types/postgresql-types";
import sqlite from "../../src/db-types/sqlite-types";
import generic from "../../src/db-types/generic-types";
import dbTypes from "../../src/db-types/db-types";
import { actions as schemaActions } from "../../src/store/slices/schema";
import { expect } from "chai";
import { DbType } from "../../src/db-grapher-schema";
import store from "../../src/store/store";

describe("db-types", () => {
  const setDbType = (dbType: DbType) =>
    store.dispatch(schemaActions.setDbType(dbType));

  describe("when db type is set to mssql", () => {
    it("should return mssql types", () => {
      setDbType(DbType.Mssql);
      expect(dbTypes()).eq(mssql);
    });
  });

  describe("when db type is set to mysql", () => {
    it("should return mysql types", () => {
      setDbType(DbType.Mysql);
      expect(dbTypes()).eq(mysql);
    });
  });

  describe("when db type is set to postgresql", () => {
    it("should return postgresql types", () => {
      setDbType(DbType.Postgresql);
      expect(dbTypes()).eq(postgresql);
    });
  });

  describe("when db type is set to sqlite", () => {
    it("should return sqlite types", () => {
      setDbType(DbType.Sqlite);
      expect(dbTypes()).eq(sqlite);
    });
  });

  describe("when db type is set to generic", () => {
    it("should return generic types", () => {
      setDbType(DbType.Generic);
      expect(dbTypes()).eq(generic);
    });
  });
});
