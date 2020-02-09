/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: 'dist',
    port: 9999
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'src/index.html',
      },
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /(?<!\.d)\.ts?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.d\.ts$/,
        loader: 'ignore-loader'
      },
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};