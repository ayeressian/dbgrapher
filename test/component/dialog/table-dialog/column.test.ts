import Columns from "../../../../src/components/dialog/table-dialog/columns";
import { initComponentTest, removeElement } from "../../../helper";
import snapshot from "./column.snap.html";
import { crush } from "html-crush";
import { expect } from "chai";

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
        },
      ],
    };
    await tableDialogColumns.updateComplete;
    shadowRoot = tableDialogColumns.shadowRoot!;
  });
  afterEach((): void => {
    removeElement(tableDialogColumns);
  });

  it("should render properly", () => {
    const html = shadowRoot!.firstElementChild!.outerHTML;
    const options = {
      removeHTMLComments: true,
    };
    const mHtml = crush(html, options).result;
    expect(mHtml).eq(snapshot);
  });
});
