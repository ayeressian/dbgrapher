import SidePanel from '../src/components/side-panel';
import { expect } from 'chai';
import { initComponentTest, removeElement } from './helper';
import store from '../src/store/store';

describe('side-panel', function() {
  let sidePanel: SidePanel;

  beforeEach(async () => {
    sidePanel = await initComponentTest('dbg-side-panel') as SidePanel;
  });

  afterEach(function() {
    removeElement(sidePanel);
  });

  describe('actions', () => {
    it('should have 2 actions', () => {
      const actions = sidePanel.shadowRoot!.querySelectorAll("ul > li.action");
      expect(actions).to.have.lengthOf(2);
    });

    it('should become active when clicked', async () => {
      const action = sidePanel.shadowRoot!.querySelector("ul > li.action") as HTMLElement;
      action.click();
      await sidePanel.updateComplete;
      expect(action).to.have.class('active');
    });

    it('should deactivate when clicked twice', async () => {
      await sidePanel.updateComplete;
      const action = sidePanel.shadowRoot!.querySelector("ul > li.action") as HTMLElement;
      debugger;
      console.log(store);
      action.click();
      await sidePanel.updateComplete;
      action.click();
      await sidePanel.updateComplete;
      expect(action).to.not.have.class('active');
    });
  });
});
