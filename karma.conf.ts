import webpackConfig from './webpack.config';

webpackConfig.mode = "development";
webpackConfig.entry = '';

export default function(config: any): void {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'karma-typescript'],

    karmaTypescriptConfig: {
      compilerOptions: {
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          module: "commonjs",
          esModuleInterop: true,
          sourceMap: true,
          target: "ES2019"
      },
      exclude: ["node_modules"]
    },

    reporters: ['progress', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    autoWatchBatchDelay: 300,

    files: [
      './dist/bundle.js',
      './test/**/*.ts'
    ],

    preprocessors: {
      './test/**/*.ts': 'karma-typescript'
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    }
  });
}