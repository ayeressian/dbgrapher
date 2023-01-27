import { actions as schemaActions } from "../../../src/store/slices/schema";
import store from "../../../src/store/store";
import { describe, it, expect, beforeEach } from "vitest";

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
            type: "Mysql",
          },
          tables: [],
        })
      );
    });
    it("should set the present schema", () => {
      expect(getStoreSchema().present.dbGrapher.type).equal("Mysql");
    });
    it("should clean feature schemas", () => {
      expect(getStoreSchema().future).to.be.empty;
    });
    describe("when set twice", () => {
      beforeEach(() => {
        store.dispatch(
          schemaActions.set({
            dbGrapher: {
              type: "Mssql",
            },
            tables: [],
          })
        );
      });
      it("should set the present schema", () => {
        expect(getStoreSchema().present.dbGrapher.type).equal("Mssql");
      });
    });
  });

  describe("setDbType", () => {
    it("should set the db type", () => {
      store.dispatch(schemaActions.setDbType("Mssql"));
      expect(getStoreSchema().present.dbGrapher.type).equal("Mssql");
    });
  });

  describe("undo", () => {
    beforeEach(() => {
      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: "Mysql",
          },
          tables: [],
        })
      );

      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: "Mssql",
          },
          tables: [],
        })
      );
    });
    it("should undo to previous shcema", () => {
      store.dispatch(schemaActions.undo());
      expect(getStoreSchema().present.dbGrapher.type).equal("Mysql");
    });
  });

  describe("redo", () => {
    beforeEach(() => {
      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: "Mysql",
          },
          tables: [],
        })
      );

      store.dispatch(
        schemaActions.set({
          dbGrapher: {
            type: "Mssql",
          },
          tables: [],
        })
      );
    });
    it("should undo to previous shcema", () => {
      store.dispatch(schemaActions.undo());
      store.dispatch(schemaActions.redo());
      expect(getStoreSchema().present.dbGrapher.type).equal("Mssql");
    });
  });
});
