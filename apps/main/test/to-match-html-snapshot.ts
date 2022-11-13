import { expect } from "vitest";
import { crush } from "html-crush";

const toMatchHtmlSnapshot = (html?: string) => {
  crush;
  const options = {
    removeHTMLComments: true,
  };
  const mHtml = crush(html ?? "", options).result;
  expect(mHtml).toMatchSnapshot();
};

export default toMatchHtmlSnapshot;
