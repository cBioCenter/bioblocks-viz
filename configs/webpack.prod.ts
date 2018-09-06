import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as common from '../webpack.chell-common';

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
