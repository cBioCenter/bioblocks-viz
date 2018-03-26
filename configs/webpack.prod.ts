import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as common from '../webpack.common';

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
