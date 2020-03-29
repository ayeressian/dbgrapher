export const deepCopy = (data: unknown) => JSON.parse(JSON.stringify(data));

export const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;