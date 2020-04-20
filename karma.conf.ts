import webpackConfig from './webpack.test.config';

export default function(config: any): void {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],

    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    autoWatchBatchDelay: 300,

    files: [
      './test/index.ts'
    ],

    preprocessors: {
      './test/index.ts': ['webpack']
    },

    webpack: webpackConfig,
  });
}