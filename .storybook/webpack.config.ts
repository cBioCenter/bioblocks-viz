// @ts-ignore
// tslint:disable-next-line: no-submodule-imports
import * as createCompiler from '@storybook/addon-docs/mdx-compiler-plugin';
import { default as CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';

import * as webpack from 'webpack';

// tslint:disable-next-line:no-relative-imports
import * as generateCommonConfig from '../webpack.bioblocks-common';

module.exports = async ({ config: storybookConfig, mode }: { config: webpack.Configuration; mode: string }) => {
  // @ts-ignore
  // tslint:disable-next-line: no-unsafe-any
  const bioblocksConfig: webpack.Configuration = generateCommonConfig((err: any, stats: any) => {
    return;
  }, storybookConfig);

  if (storybookConfig.module && storybookConfig.plugins && bioblocksConfig.module && bioblocksConfig.module.rules) {
    storybookConfig.entry = Array.isArray(storybookConfig.entry)
      ? [...storybookConfig.entry, './frames/BBFrame.tsx']
      : storybookConfig.entry;

    storybookConfig.module.rules = getModuleRules(bioblocksConfig.module.rules);
    storybookConfig.optimization = bioblocksConfig.optimization;
    storybookConfig.plugins.push(
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        chunks: ['main', 'vendor'],
        favicon: 'assets/favicons/favicon.ico',
        filename: 'bioblocks.html',
        inject: true,
        template: './frames/bioblocks.html',
      }),
      ...getPlugins(bioblocksConfig),
    );
    storybookConfig.resolve = getAliases(storybookConfig, bioblocksConfig);

    // @ts-ignore
    storybookConfig.output = {
      ...storybookConfig.output,
      filename: (chunkData: { chunk: { name: string } }) => {
        return chunkData.chunk.name.includes('frame') ? 'bioblocks-frame.js' : '[name].[hash].bundle.js';
      },
    };

    return storybookConfig;
  }

  return bioblocksConfig;
};

const getPlugins = (bioblocksConfig: webpack.Configuration) => {
  return bioblocksConfig.plugins
    ? bioblocksConfig.plugins.filter(
        plugin => plugin instanceof CleanWebpackPlugin === false && plugin instanceof HtmlWebpackPlugin === false,
      )
    : [];
};

const getModuleRules = (bioblocksRules: webpack.RuleSetRule[]): webpack.RuleSetRule[] => {
  return [
    ...bioblocksRules.filter(rule =>
      rule.test && rule.test.toString().localeCompare('/\\.tsx?$/') !== 0 ? rule : undefined,
    ),
    {
      test: /\.(stories|story).mdx$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [['react-app', { flow: false, typescript: true }]],
          },
        },
        {
          loader: 'react-docgen-typescript-loader',
        },
        {
          loader: '@mdx-js/loader',
          options: {
            // tslint:disable-next-line: no-unsafe-any
            compilers: [createCompiler({})],
          },
        },
      ],
    },
    {
      exclude: /\.(stories|story).mdx$/,
      test: /\.mdx$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [['react-app', { flow: false, typescript: true }]],
          },
        },
        {
          loader: '@mdx-js/loader',
        },
      ],
    },
    {
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, '../frames'),
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../.storybook'),
        path.resolve(__dirname, '../docs/stories'),
      ],
      test: /\.ts(x?)$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, '../configs/tsconfig.publish.json'),
            context: __dirname,
            transpileOnly: true,
          },
        },
        {
          loader: 'react-docgen-typescript-loader',
        },
      ],
    },
    {
      enforce: 'pre',
      exclude: [/node_modules/],
      loader: require.resolve('@storybook/source-loader'),
      test: /\.(stories|story)\.[tj]sx?$/,
    },
  ];
};

const getAliases = (storybookConfig: webpack.Configuration, bioblocksConfig: webpack.Configuration) => {
  return {
    ...storybookConfig.resolve,
    ...bioblocksConfig.resolve,
    alias:
      bioblocksConfig.resolve && storybookConfig.resolve
        ? {
            ...bioblocksConfig.resolve.alias,
            ...storybookConfig.resolve.alias,
          }
        : {},
  };
};
