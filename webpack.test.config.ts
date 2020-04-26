import { Configuration } from 'webpack';
import config from './webpack.config';

const testConfig: Configuration = {
  ...config,
  mode: 'development',
  entry: '',
};

testConfig.module?.rules.push({
  test: /\.html$/,
  loader: "raw-loader"
});

export default testConfig;
