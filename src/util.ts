export const deepCopy = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const isMac = navigator.platform.toUpperCase().includes('MAC');