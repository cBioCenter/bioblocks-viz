import { default as CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as webpack from 'webpack';
// TODO: Use https://github.com/TypeStrong/typedoc and https://github.com/Microsoft/Typedoc-Webpack-Plugin
// tslint:disable-next-line:no-var-requires
// const TypedocWebpackPlugin = require('typedoc-webpack-plugin'); //

import * as path from 'path';

// tslint:disable-next-line: export-name  max-func-body-length
export const generateCommonConfig = (
  env: webpack.Compiler.Handler,
  argv: webpack.Configuration,
): webpack.Configuration => ({
  entry: {
    bioblocks: './frames/BBFrame.tsx',
    example: './docs/example/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(
              __dirname,
              'configs',
              argv.mode === 'development' ? 'tsconfig.dev.json' : 'tsconfig.webpack.json',
            ),
            context: __dirname,
          },
        },
      },
      {
        // Needed for Plotly.js: https://github.com/plotly/plotly.js#building-plotlyjs-with-webpack
        loader: 'ify-loader',
        test: /\.js$/,
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
          {
            loader: `image-webpack-loader`,
            options: {
              query: {
                bypassOnDebug: true,
                gifsicle: {
                  interlaced: true,
                },
                mozjpeg: {
                  progressive: true,
                },
                optipng: {
                  optimizationLevel: 7,
                },
              },
            },
          },
        ],
      },
      {
        include: [path.resolve(__dirname, 'node_modules/anatomogram')],
        test: /\.(svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      automaticNameDelimiter: '~',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: chunk => chunk.name !== 'bioblocks',
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      maxSize: 0,
      minChunks: 1,
      minSize: 30000,
      name: true,
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['example'],
      favicon: 'assets/favicons/favicon.ico',
      filename: 'index.html',
      inject: true,
      template: './docs/example/index.html',
      title: 'Bioblocks Visualization Library',
    }) as webpack.Plugin,
    new HtmlWebpackPlugin({
      chunks: ['bioblocks'],
      favicon: 'assets/favicons/favicon.ico',
      filename: 'bioblocks.html',
      inject: true,
      template: './frames/bioblocks.html',
    }) as webpack.Plugin,
    new CopyWebpackPlugin([
      {
        from: './assets',
        ignore: ['*.pdf'],
        to: './assets',
        toType: 'dir',
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: './datasets',
        ignore: ['*.pdf'],
        to: './datasets',
        toType: 'dir',
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: './SPRING_dev',
        to: './',
        toType: 'dir',
      },
    ]),
    new MiniCssExtractPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  resolve: {
    alias: {
      ngl: path.resolve(__dirname, './node_modules/ngl/dist/ngl.esm.js'),
      'plotly.js/lib/index': path.resolve(__dirname, './node_modules/plotly.js/dist/plotly.min.js'),
      'plotly.js/lib/index-gl2d': path.resolve(__dirname, './node_modules/plotly.js/dist/plotly-gl2d.min.js'),
      'plotly.js/lib/index-gl3d': path.resolve(__dirname, './node_modules/plotly.js/dist/plotly-gl3d.min.js'),
      '~bioblocks-viz~': path.resolve(__dirname, './src'),
      '~bioblocks-viz~/action': path.resolve(__dirname, './src/action'),
      '~bioblocks-viz~/component': path.resolve(__dirname, './src/component'),
      '~bioblocks-viz~/container': path.resolve(__dirname, './src/container'),
      '~bioblocks-viz~/context': path.resolve(__dirname, './src/context'),
      '~bioblocks-viz~/data': path.resolve(__dirname, './src/data'),
      '~bioblocks-viz~/helper': path.resolve(__dirname, './src/helper'),
      '~bioblocks-viz~/hoc': path.resolve(__dirname, './src/hoc'),
      '~bioblocks-viz~/reducer': path.resolve(__dirname, './src/reducer'),
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'types'), path.resolve('node_modules'), 'node_modules'],
  },
});

module.exports = (env: webpack.Compiler.Handler, argv: webpack.Configuration) => {
  return generateCommonConfig(env, argv);
};
