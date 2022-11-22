export interface Item {
    id: string;
    title: string;
    items?: Item[];
}
export interface TopMenuConfig {
    items: Item[];
}
declare const getConfig: () => TopMenuConfig;
export default getConfig;
