import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import "webpack-dev-server";

type CLIValues = boolean | string;
type EnvValues = Record<string, CLIValues>;
type Argv = Record<string, CLIValues>;

export default (env?: EnvValues, argv?: Argv): Configuration => {
  const inDevelopment = argv?.mode === "development";

  const config: Configuration = {
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
  };

  if (!inDevelopment) {
    config.plugins?.push(
      new GenerateSW({
        maximumFileSizeToCacheInBytes: 10485760,
      })
    );
  }
  return config;
};
