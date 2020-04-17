import SidePanel from '../src/components/side-panel';
import { expect } from 'chai';

describe('side-panel', function() {
  let sidePanel: SidePanel;

  // inject the HTML fixture for the tests
  beforeEach(function() {
    const sidePanel = document.createElement('dbg-side-panel');

    document.body.insertAdjacentElement(
      'afterbegin', 
      sidePanel);
  });

  afterEach(function() {
    sidePanel.outerHTML = '';
  });

  it('should have 2 actions', async () => {
    await sidePanel.updateComplete;
    const actions = sidePanel.shadowRoot!.querySelectorAll("ul > li.action");
    expect(actions).to.have.lengthOf(2);
  });

});
