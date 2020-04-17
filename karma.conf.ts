import webpackConfig from './webpack.config';
webpackConfig.mode = "development";
webpackConfig.entry = '';

export default function(config: any): void {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],

    reporters: ['progress'],
    port: 9876,
    colors: false,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      './dist/bundle.js',
      './test/**/*.js'],

    preprocessors: {
      './dist/bundle.js': ['webpack'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    }
  });
}