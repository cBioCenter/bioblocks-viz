import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

import * as path from 'path';

module.exports = {
  devServer: {
    contentBase: './dist',
  },
  devtool: 'inline-source-map',
  entry: './index.tsx',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: './index.html',
      title: 'Development',
    }),
    new CopyWebpackPlugin([
      {
        from: './assets',
        to: './assets',
        toType: 'dir',
      },
    ]),
  ],
  resolve: {
    alias: {
      tsnejs: 'tsnejs/tsne',
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'types'), 'node_modules'],
  },
};
