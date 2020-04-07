import { createSlice } from '@reduxjs/toolkit';
import TopMenuConfig from './top-menu-config-interface';

const config = {
  items: [{
      id: 'file',
      title: 'File',
      items: [{
          id: 'new',
          title: 'New Schema'
        },
        {
          id: 'open',
          title: 'Open Schema'
        },
        {
          id: 'exportSql',
          title: 'Export SQL'
        },
        {
          id: 'downloadSchema',
          title: 'Download'
        }
      ]
    },
    {
      id: 'help',
      title: 'Help',
      items: [{
        id: 'reportIssue',
        title: 'Report an issue'
      }, {
        id: 'about',
        title: 'About'
      }]
    }
  ],
  rightItems: [{
      id: 'gitHub',
      title: 'GitHub'
    }
  ]
};

const slice = createSlice({
  initialState: config as TopMenuConfig,
  name: 'top-menu-config',
  reducers: {},
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
