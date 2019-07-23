import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

// tslint:disable-next-line:no-relative-imports
import * as generateCommonConfig from '../webpack.bioblocks-common';

const prodConfig = {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

module.exports = (env: webpack.Compiler.Handler, argv: webpack.Configuration) => {
  // @ts-ignore
  // tslint:disable-next-line: no-unsafe-any
  return merge(generateCommonConfig(env, argv), prodConfig);
};
