import SidePanel from '../src/components/side-panel';
import { initComponentTest, removeElement } from './helper';

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
      expect(actions.length).toEqual(5);
    });

    it('should become active when clicked', async () => {
      const action = sidePanel.shadowRoot!.querySelector("ul > li.action") as HTMLElement;
      action.click();
      await sidePanel.updateComplete;
      expect(action).toHaveClass('active');
    });

    it('should deactivate when clicked twice', async () => {
      const action = sidePanel.shadowRoot!.querySelector("ul > li.action") as HTMLElement;
      action.click();
      await sidePanel.updateComplete;
      action.click();
      await sidePanel.updateComplete;
      expect(action.classList).not.toContain('active'); 
    });
  });
});
