import webpackConfig from './webpack.config';

webpackConfig.mode = "development";
webpackConfig.entry = '';

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
      './dist/bundle.js',
      './test/**/*.test.ts'
    ],

    preprocessors: {
      './test/**/*.ts': ['webpack']
    },

    webpack: webpackConfig,
  });
}