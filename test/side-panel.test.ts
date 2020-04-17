import SidePanel from '../src/components/side-panel';
import { expect } from 'chai';

describe('side-panel', function() {
  let sidePanel: SidePanel;

  // inject the HTML fixture for the tests
  beforeEach(function() {
    const fixture = '<dbg-side-panel></dbg-side-panel>';

    document.body.insertAdjacentHTML(
      'afterbegin', 
      fixture);
    
    sidePanel = (document.querySelector("dbg-side-panel") as SidePanel)!;
  });

  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture')!);
  });

  it('should have 2 actions', async () => {
    await sidePanel.updateComplete;
    const actions = sidePanel.shadowRoot!.querySelectorAll("ul > li.action");
    expect(actions.length).to.eq(2);
  });

});
