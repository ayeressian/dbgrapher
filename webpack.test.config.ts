import { Configuration } from 'webpack';
import config from './webpack.config';

const testConfig: Configuration = {
  ...config,
  mode: 'development',
  entry: '',
};

export default testConfig;
