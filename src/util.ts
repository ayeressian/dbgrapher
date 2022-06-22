export const isMac = navigator.platform.toUpperCase().includes("MAC");

export const isSafari = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent
);

// https://stackoverflow.com/a/30832210
export const download = (
  data: string,
  filename: string,
  type: string
): void => {
  const file = new Blob([data], { type });

  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  });
};

export const wait = (time?: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));
