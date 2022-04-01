import config from "./webpack.config";
import path from "path";

const testConfig = config({}, { mode: "development" });

testConfig.module?.rules?.push({
  test: /\.html$/,
  loader: "raw-loader",
});

testConfig.module?.rules?.push({
  test: /\.ts$/,
  exclude: [path.resolve(__dirname, "test")],
  enforce: "post",
  use: {
    loader: "istanbul-instrumenter-loader",
    options: { esModules: true },
  },
});

export default testConfig;
