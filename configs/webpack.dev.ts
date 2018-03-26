import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as common from '../webpack.common';

module.exports = merge(common, {
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
