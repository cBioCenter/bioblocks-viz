import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import { Config } from 'html-webpack-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

// tslint:disable-next-line:no-relative-imports
import * as generateCommonConfig from '../webpack.bioblocks-common';

const devConfig: Config = {
  devServer: {
    contentBase: './dist',
    hot: true,
    index: 'example.html',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: './datasets',
        to: './datasets',
        toType: 'dir',
      },
    ]),
  ],
};

module.exports = (env: webpack.Compiler.Handler, argv: webpack.Configuration) => {
  // @ts-ignore
  // tslint:disable-next-line: no-unsafe-any
  return merge(generateCommonConfig(env, argv), devConfig);
};
