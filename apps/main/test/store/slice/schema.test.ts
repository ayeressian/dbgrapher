import { expect } from "chai";
import { DbType } from "../../../src/db-grapher-schema";
import {
  actions as schemaActions,
  DEFAULT_VIEW_WIDTH,
  MAX_VIEW_HEIGHT,
  MAX_VIEW_WIDTH,
  MIN_VIEW_HEIGHT,
  MIN_VIEW_WIDTH,
  VIEW_INCREASE_AMOUNT,
} from "../../../src/store/slices/schema";
import store from "../../../src/store/store";

const getStoreSchema = () => store.getState().schema;

describe("schema actions", () => {
  beforeEach(() => {
    store.dispatch({ type: "RESET" });
  });

  describe("set", () => {
    beforeEach(() => {
      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: DbType.Mysql,
          },
          tables: [],
        })
      );
    });
    it("should set the present schema", () => {
      expect(getStoreSchema().present.dbGrapher.type).equal(DbType.Mysql);
    });
    it("should clean feature schemas", () => {
      expect(getStoreSchema().future).to.be.empty;
    });
    describe("when set twice", () => {
      beforeEach(() => {
        store.dispatch(
          schemaActions.set({
            dbGrapher: {
              type: DbType.Mssql,
            },
            tables: [],
          })
        );
      });
      it("should set the present schema", () => {
        expect(getStoreSchema().present.dbGrapher.type).equal(DbType.Mssql);
      });
    });
  });

  describe("setDbType", () => {
    it("should set the db type", () => {
      store.dispatch(schemaActions.setDbType(DbType.Mssql));
      expect(getStoreSchema().present.dbGrapher.type).equal(DbType.Mssql);
    });
  });

  describe("undo", () => {
    beforeEach(() => {
      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: DbType.Mysql,
          },
          tables: [],
        })
      );

      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: DbType.Mssql,
          },
          tables: [],
        })
      );
    });
    it("should undo to previous shcema", () => {
      store.dispatch(schemaActions.undo());
      expect(getStoreSchema().present.dbGrapher.type).equal(DbType.Mysql);
    });
  });

  describe("redo", () => {
    beforeEach(() => {
      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: DbType.Mysql,
          },
          tables: [],
        })
      );

      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: DbType.Mssql,
          },
          tables: [],
        })
      );
    });
    it("should undo to previous shcema", () => {
      store.dispatch(schemaActions.undo());
      store.dispatch(schemaActions.redo());
      expect(getStoreSchema().present.dbGrapher.type).equal(DbType.Mssql);
    });
  });
});
