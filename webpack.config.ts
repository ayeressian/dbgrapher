import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack";

export default {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: "dist",
    port: 9999
  },
  plugins: [
    new CopyPlugin([
      {
        from: "src/index.html"
      },
      {
        from: 'asset/',
        to: 'asset/'
      },
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /(?<!\.d)\.ts?$/,
        loader: "ts-loader"
      },
      {
        test: /\.d\.ts$/,
        loader: "ignore-loader"
      },
      {
        test: /\.css$/,
        loader: "css-loader"
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
} as webpack.Configuration;
