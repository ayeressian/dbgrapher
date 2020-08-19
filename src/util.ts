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
  // IE10+
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    // Others
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
  }
};

export const wait = (time?: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

export function formatText(text: string, replaceTexts?: object): string;
export function formatText(
  text: string,
  replaceTexts?: string,
  ...replaceTextsRest: string[]
): string;
export function formatText(
  text: string,
  replaceTexts?: string | object,
  ...replaceTextsRest: string[]
): string {
  if (replaceTexts) {
    if (typeof replaceTexts === "string") {
      replaceTextsRest.unshift(replaceTexts);
      replaceTextsRest.forEach(
        (replaceText, index) =>
          (text = text.replace(`$${index + 1}`, replaceText))
      );
    } else {
      Object.entries(replaceTexts).forEach(([key, value]) => {
        text = text.replace(`$${key}`, value);
      });
    }
  }
  return text;
}
