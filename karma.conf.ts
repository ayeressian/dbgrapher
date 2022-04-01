import webpackConfig from "./webpack.test.config";
import { Configuration } from "webpack";
import path from "path";
import { Config } from "karma";
import playwright from "playwright";

process.env.WEBKIT_BIN = playwright.webkit.executablePath();
process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();

declare module "karma" {
  interface ConfigOptions {
    webpack?: Configuration;
    webpackMiddleware: {
      noInfo: boolean;
    };
    coverageIstanbulReporter: {
      reports: string[];
      dir: string;
      fixWebpackSourcePaths: boolean;
      "report-config": {
        html: { outdir: string };
      };
    };
  }
}

delete webpackConfig.entry;

const browsers = process.env.HEADLESS
  ? ["ChromeHeadless", "FirefoxHeadless", "WebkitHeadless"]
  : ["Chrome", "Firefox", "Webkit"];

export default function (config: Config): void {
  config.set({
    browsers,
    frameworks: ["mocha", "webpack"],
    reporters: ["spec", "coverage-istanbul"],
    files: ["test/index.ts"],
    preprocessors: {
      "test/index.ts": ["webpack"],
    },
    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    coverageIstanbulReporter: {
      reports: ["html", "text-summary", "lcovonly"],
      dir: path.join(__dirname, "coverage"),
      fixWebpackSourcePaths: true,
      "report-config": {
        html: { outdir: "html" },
      },
    },
  });
}
