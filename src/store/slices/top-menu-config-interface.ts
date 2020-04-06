export interface Item {
  id: string;
  title: string;
  items?: Item[];
}

export interface RightItem {
  id: string;
  title: string;
}

export default interface TopMenuConfig {
  items: Item[];
  rightItems: RightItem[];
// eslint-disable-next-line semi
}
