import webpackConfig from "./webpack.test.config";
import path from "path";

delete webpackConfig.entry;

// Because karama typescript doesn't have summaryReporter and webpack props
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export default function (config: any): void {
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
