import webpackConfig from "./webpack.test.config";

// Because karama typescript doesn't have summaryReporter and webpack props
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export default function (config: any): void {
  config.set({
    frameworks: ["mocha"],

    reporters: ["progress", "summary"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    autoWatchBatchDelay: 300,

    files: ["./test/index.ts"],

    preprocessors: {
      "./test/index.ts": ["webpack"],
    },

    summaryReporter: {
      show: "all",
    },

    webpack: webpackConfig,
  });
}
