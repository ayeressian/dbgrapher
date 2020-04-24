import '../src/components/welcome-dialog';
import WelcomeDialog from '../src/components/welcome-dialog';
import { initComponentTest, removeElement } from './helper';
import { expect } from 'chai';

describe('welcome-dialog', function() {
  let welcomeDialog: WelcomeDialog;

  beforeEach(async () => {
    welcomeDialog = await initComponentTest('dbg-welcome-dialog') as WelcomeDialog;
  });

  afterEach(function() {
    removeElement(welcomeDialog);
  });

  it ('should have 2 actions', () => {
    expect(welcomeDialog.shadowRoot!.querySelectorAll('.operation-container')).to.have.lengthOf(2);
  });
});
