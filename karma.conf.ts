import webpackConfig from "./webpack.test.config";
import { Configuration } from "webpack";
import path from "path";
import { Config } from "karma";

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

export default function (config: Config): void {
  config.set({
    browsers: ["Chrome"],
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
