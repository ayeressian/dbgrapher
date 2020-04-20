import '../src/components/dialog';
import Dialog from '../src/components/dialog';
import { initComponentTest, removeElement } from './helper';
import { expect } from 'chai';

describe('dialog', function() {
  let dialog: Dialog;

  beforeEach(async () => {
    dialog = await initComponentTest('dbg-dialog') as Dialog;
  });

  afterEach(function() {
    removeElement(dialog);
  });

  it ('should not be visible', () => {
    expect(dialog.shadowRoot!.querySelector('div')).to.have.class('hide');
  });

  it ('should be visible when show attribute exist', async () => {
    dialog.setAttribute('show', '');
    await dialog.updateComplete;
    expect(dialog.shadowRoot!.querySelector('div')).to.not.have.class('hide');
  });
});
