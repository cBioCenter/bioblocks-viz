import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as common from '../webpack.common';

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
