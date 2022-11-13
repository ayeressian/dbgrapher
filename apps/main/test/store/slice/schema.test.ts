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

  describe("increaseViewSize", () => {
    it("should increase view size", () => {
      store.dispatch(schemaActions.increaseViewSize());
      expect(getStoreSchema().present.viewHeight).equal(
        DEFAULT_VIEW_WIDTH + VIEW_INCREASE_AMOUNT
      );
    });

    describe("when view size is max", () => {
      beforeEach(() => {
        store.dispatch(
          schemaActions.set({
            dbGrapher: {
              type: DbType.Generic,
            },
            tables: [],
            viewHeight: MAX_VIEW_HEIGHT,
            viewWidth: MAX_VIEW_WIDTH,
          })
        );
      });

      it("should not increase viewHeight more than max", () => {
        store.dispatch(schemaActions.increaseViewSize());
        expect(getStoreSchema().present.viewHeight).equal(MAX_VIEW_HEIGHT);
      });

      it("should not increase viewWidth more than max", () => {
        store.dispatch(schemaActions.increaseViewSize());
        expect(getStoreSchema().present.viewWidth).equal(MAX_VIEW_WIDTH);
      });
    });
  });

  describe("decreaseViewSize", () => {
    it("should decrease view size", () => {
      store.dispatch(schemaActions.decreaseViewSize());
      expect(getStoreSchema().present.viewHeight).equal(
        DEFAULT_VIEW_WIDTH - VIEW_INCREASE_AMOUNT
      );
    });

    describe("when view size is min", () => {
      beforeEach(() => {
        store.dispatch(
          schemaActions.set({
            dbGrapher: {
              type: DbType.Generic,
            },
            tables: [],
            viewHeight: MIN_VIEW_HEIGHT,
            viewWidth: MIN_VIEW_WIDTH,
          })
        );
      });

      it("should not decrease viewHeight less than min", () => {
        store.dispatch(schemaActions.decreaseViewSize());
        expect(getStoreSchema().present.viewHeight).equal(MIN_VIEW_HEIGHT);
      });

      it("should not decrease viewWidth less than min", () => {
        store.dispatch(schemaActions.decreaseViewSize());
        expect(getStoreSchema().present.viewWidth).equal(MIN_VIEW_WIDTH);
      });
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
