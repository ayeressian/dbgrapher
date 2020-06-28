import WelcomeDialog from '../src/components/new-open-dialog';
import { initComponentTest, removeElement } from './helper';

describe('welcome-dialog', function() {
  let welcomeDialog: WelcomeDialog;

  beforeEach(async () => {
    welcomeDialog = await initComponentTest('dbg-welcome-dialog') as WelcomeDialog;
  });

  afterEach(function() {
    removeElement(welcomeDialog);
  });

  it ('should have 2 actions', () => {
    expect(welcomeDialog.shadowRoot!.querySelectorAll('.operation-container').length).toEqual(2);
  });
});
