import '../src/components/top-menu';
import TopMenu from '../src/components/top-menu';
import { expect } from 'chai';
import { initComponentTest, removeElement } from './helper';

describe('top-menu', function() {
  let topMenu: TopMenu;

  const config = {
    items: [{
        id: 'one',
        title: 'oneTitle',
        items: [{
            id: 'oneSubOne',
            title: 'oneSubOneTilte'
          },
          {
            id: 'oneSubTwo',
            title: 'oneSubTwoTitle'
          },
          {
            id: 'oneSubThree',
            title: 'oneSubThreeTitle'
          },
        ]
      },
      {
        id: 'two',
        title: 'twoTitle',
        items: [{
          id: 'twoSubOne',
          title: 'twoSubOneTitle'
        }]
      }
    ],
    rightItems: [{
        id: 'right',
        title: 'rightTitle'
      }
    ]
  };

  beforeEach(async () => {
    topMenu = await initComponentTest('dbg-top-menu') as TopMenu;
    topMenu.config = config;
    await topMenu.updateComplete;
  });

  afterEach(function() {
    removeElement(topMenu);
  });

  it ('should render correct number of top left items', () => {
    const topLeftItems = topMenu.shadowRoot!.querySelectorAll('ul > li:not(.right-menu-item)')!;
    expect(topLeftItems).to.have.lengthOf(config.items.length);
  });

  it ('should render correct number of top right items', () => {
    const topRightItems = topMenu.shadowRoot!.querySelectorAll('ul > li.right-menu-item')!;
    expect(topRightItems).to.have.lengthOf(config.rightItems.length);
  });

  describe('when clicked on top item', () => {
    beforeEach(async () => {
      (topMenu.shadowRoot!.querySelector('ul > li') as HTMLElement).click();
      await topMenu.updateComplete;
    });
    it ('should open dropdown view', () => {
      const dropDown = topMenu.shadowRoot!.querySelector('.dropdown');
      expect(dropDown).to.have.class('show');
    });

    it ('should have correct number of subItems', () => {
      const subItems = topMenu.shadowRoot!.querySelectorAll('.dropdown li');
      expect(subItems).to.have.lengthOf(config.items[0].items.length);
    });
  });
});
