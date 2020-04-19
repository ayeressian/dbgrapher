export const deepCopy = <T extends object>(data: T): T => JSON.parse(JSON.stringify(data));
export const deepEqual = <T extends object>(data1: T, data2: T): boolean => JSON.stringify(data1) === JSON.stringify(data2);

export const isMac = navigator.platform.toUpperCase().includes('MAC');

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// https://stackoverflow.com/a/30832210
export const download = (data: string, filename: string, type: string): void => {
  const file = new Blob([data], {type});
  // IE10+
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else { // Others
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
};
