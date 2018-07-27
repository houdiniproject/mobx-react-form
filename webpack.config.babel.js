import { join } from 'path';

const loaders = [{
  test: /\.js$/,
  loader: 'babel-loader',
  include: join(__dirname, 'src'),
}, {
  test: /\.json$/,
  loader: 'json-loader',
}];

export default {
  devtool: 'source-map',
  entry: ['babel-polyfill','./src/index'],
  output: {
    path: join(__dirname, 'umd'),
    library: 'MobxReactForm',
    libraryTarget: 'umd',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
  },
  externals: {
    mobx: 'mobx',
  },
  module: { loaders },
};
