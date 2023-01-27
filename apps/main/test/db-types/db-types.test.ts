import mssql from "../../src/db-types/mssql-types";
import mysql from "../../src/db-types/mysql-types";
import postgresql from "../../src/db-types/postgresql-types";
import sqlite from "../../src/db-types/sqlite-types";
import generic from "../../src/db-types/generic-types";
import dbTypes from "../../src/db-types/db-types";
import { actions as schemaActions } from "../../src/store/slices/schema";
import { DbType } from "../../src/db-grapher-schema";
import store from "../../src/store/store";
import { describe, it, expect } from "vitest";

describe("db-types", () => {
  const setDbType = (dbType: DbType) =>
    store.dispatch(schemaActions.setDbType(dbType));

  describe("when db type is set to mssql", () => {
    it("should return mssql types", () => {
      setDbType("Mssql");
      expect(dbTypes()).eq(mssql);
    });
  });

  describe("when db type is set to mysql", () => {
    it("should return mysql types", () => {
      setDbType("Mysql");
      expect(dbTypes()).eq(mysql);
    });
  });

  describe("when db type is set to postgresql", () => {
    it("should return postgresql types", () => {
      setDbType("Postgresql");
      expect(dbTypes()).eq(postgresql);
    });
  });

  describe("when db type is set to sqlite", () => {
    it("should return sqlite types", () => {
      setDbType("Sqlite");
      expect(dbTypes()).eq(sqlite);
    });
  });

  describe("when db type is set to generic", () => {
    it("should return generic types", () => {
      setDbType("Generic");
      expect(dbTypes()).eq(generic);
    });
  });
});
