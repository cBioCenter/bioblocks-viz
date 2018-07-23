import { Config } from 'html-webpack-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as common from '../webpack.common';

const devConfig: Config = {
  devServer: {
    contentBase: './dist',
    hot: true,
    index: 'app.html',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

module.exports = merge(common, devConfig);
