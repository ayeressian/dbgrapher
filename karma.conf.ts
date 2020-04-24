import webpackConfig from './webpack.test.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function(config: any): void {
  config.set({
    basePath: '',
    frameworks: ['mocha'],

    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    autoWatchBatchDelay: 300,

    files: [
      './test/*.test.ts'
    ],

    preprocessors: {
      './test/*.test.ts': ['webpack']
    },

    webpack: webpackConfig,
  });
}