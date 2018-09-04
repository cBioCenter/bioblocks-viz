import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';

// TODO: Use https://github.com/TypeStrong/typedoc and https://github.com/Microsoft/Typedoc-Webpack-Plugin
// tslint:disable-next-line:no-var-requires
// const TypedocWebpackPlugin = require('typedoc-webpack-plugin'); //

import * as path from 'path';

module.exports = {
  entry: {
    app: './index.tsx',
    tcontainer: './TContainer.tsx',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'configs', 'tsconfig.webpack.json'),
            context: __dirname,
          },
        },
      },
      {
        // Needed for Plotly.js: https://github.com/plotly/plotly.js#building-plotlyjs-with-webpack
        loader: 'ify-loader',
        test: /\.js$/,
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      favicon: 'assets/favicons/favicon.ico',
      filename: 'app.html',
      inject: true,
      template: './index.html',
      title: 'Development',
    }),
    new HtmlWebpackPlugin({
      chunks: ['tcontainer'],
      favicon: 'assets/favicons/favicon.ico',
      filename: 'TContainer.html',
      inject: true,
      template: './TContainer.html',
      title: 'TContainer',
    }),
    new CopyWebpackPlugin([
      {
        from: './assets',
        ignore: ['*.pdf'],
        to: './assets',
        toType: 'dir',
      },
    ]),
    new webpack.NamedModulesPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'types'), 'node_modules'],
  },
};
