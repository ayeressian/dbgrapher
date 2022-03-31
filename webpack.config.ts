import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WorkboxPlugin from "workbox-webpack-plugin";

const inDevelopment = process.env.NODE_ENV === "development";

export default {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  devServer: {
    static: "dist",
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
      hash: false,
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
        type: "asset",
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
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: inDevelopment
      ? "static/js/[name].js"
      : "static/js/[name].[contenthash:8].js",
    chunkFilename: inDevelopment
      ? "static/js/[name].chunk.js"
      : "static/js/[name].[contenthash:8].chunk.js",
    assetModuleFilename: "static/media/[name][contenthash:8][ext]",
    clean: true,
  },
} as webpack.Configuration;
