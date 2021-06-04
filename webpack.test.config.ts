import { Configuration } from "webpack";
import config from "./webpack.config";

const testConfig: Configuration = {
  ...config,
  mode: "development",
};

testConfig.module?.rules?.push({
  test: /\.html$/,
  loader: "raw-loader",
});

export default testConfig;
