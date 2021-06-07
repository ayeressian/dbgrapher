import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WorkboxPlugin from "workbox-webpack-plugin";

export default {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "dist",
    port: 9999,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "asset/",
          to: "asset/",
        },
        {
          from: "src/manifest.json",
          to: "manifest.json",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "src/index.html",
    }),
    new WorkboxPlugin.GenerateSW({
      maximumFileSizeToCacheInBytes: 10485760,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /(?<!\.d)\.ts?$/,
        loader: "ts-loader",
      },
      {
        test: /\.d\.ts$/,
        loader: "ignore-loader",
      },
      {
        test: /\.css$/,
        loader: "css-loader",
      },
    ],
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
} as webpack.Configuration;
