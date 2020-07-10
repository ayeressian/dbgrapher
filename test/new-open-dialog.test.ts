import NewOpenDialog from '../src/components/new-open-dialog';
import { initComponentTest, removeElement } from './helper';

describe('new-open-dialog', function() {
  let welcomeDialog: NewOpenDialog;

  beforeEach(async () => {
    welcomeDialog = await initComponentTest('dbg-new-open-dialog') as NewOpenDialog;
  });

  afterEach(function() {
    removeElement(welcomeDialog);
  });

  it ('should have 2 actions', () => {
    expect(welcomeDialog.shadowRoot!.querySelectorAll('.operation-container').length).toEqual(2);
  });
});
