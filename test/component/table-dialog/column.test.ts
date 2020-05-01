import Columns from '../../../src/components/table-dialog/columns';
import { initComponentTest, removeElement } from '../helper';
import snapshot from './column.snap.html';

describe('table-dialog-column', function() {
  let tableDialog: Columns;
  let shadowRoot: ShadowRoot;

  beforeEach(async function(): Promise<void> {
    tableDialog = await initComponentTest('dbg-table-dialog-columns') as Columns;
    await tableDialog.updateComplete;
    shadowRoot = tableDialog.shadowRoot!;
  });
  afterEach(function(): void {
    removeElement(tableDialog);
  });

  it('should render properly', function() {
    expect(shadowRoot!.firstElementChild!.outerHTML.replace(/\s/g, '')).toEqual(snapshot.replace(/\s/g, ''));
  });
});
