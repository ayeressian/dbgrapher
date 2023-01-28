import "../../../../src/components/import-components";
import Columns from "../../../../src/components/dialog/table-dialog/columns";
import { initComponentTest, removeElement } from "../../../helper";
import { describe, it, beforeEach, afterEach } from "vitest";
import toMatchHtmlSnapshot from "../../../to-match-html-snapshot";

describe("table-dialog-column", () => {
  let tableDialogColumns: Columns;
  let shadowRoot: ShadowRoot;

  beforeEach(async (): Promise<void> => {
    tableDialogColumns = await initComponentTest({
      elementType: "dbg-table-dialog-columns",
      noUpdate: true,
      attrs: {
        tableIndex: "0",
      },
    });
    tableDialogColumns.schema = {
      tables: [
        {
          name: "test",
          columns: [],
          pos: {
            x: 0,
            y: 0,
          },
        },
      ],
    };
    await tableDialogColumns.updateComplete;
    shadowRoot = tableDialogColumns.getShadowRoot();
  });
  afterEach((): void => {
    removeElement(tableDialogColumns);
  });

  it("should render properly", () => {
    toMatchHtmlSnapshot(shadowRoot?.innerHTML);
  });
});
