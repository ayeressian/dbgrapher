import webpackConfig from './webpack.test.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function(config: any): void {
  config.set({
    frameworks: ['jasmine'],

    reporters: ['progress', 'summary'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    autoWatchBatchDelay: 300,

    files: [
      './test/index.ts',
    ],

    preprocessors: {
      './test/index.ts': ['webpack'],
    },

    summaryReporter: {
      show: 'all'
    },

    webpack: webpackConfig,
  });
}