import Columns from "../../src/components/dialog/table-dialog/columns";
import { initComponentTest, removeElement } from "../helper";
import snapshot from "./column.snap.html";
import { crush } from "html-crush";
import { expect } from "chai";

describe("table-dialog-column", function () {
  let tableDialogColumns: Columns;
  let shadowRoot: ShadowRoot;

  beforeEach(async function (): Promise<void> {
    tableDialogColumns = (await initComponentTest({
      elementType: "dbg-table-dialog-columns",
      noUpdate: true,
      attrs: {
        tableIndex: "0",
      },
    })) as Columns;
    tableDialogColumns.schema = {
      tables: [
        {
          name: "test",
          columns: [],
        },
      ],
    };
    await tableDialogColumns.requestUpdate();
    shadowRoot = tableDialogColumns.shadowRoot!;
  });
  afterEach(function (): void {
    removeElement(tableDialogColumns);
  });

  it("should render properly", function () {
    const html = shadowRoot!.firstElementChild!.outerHTML;
    const options = {
      removeHTMLComments: true,
    };
    const mHtml = crush(html, options).result;
    console.log(mHtml);
    expect(mHtml).eq(snapshot);
  });
});
