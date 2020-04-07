export const deepCopy = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const isMac = navigator.platform.toUpperCase().includes('MAC');

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
