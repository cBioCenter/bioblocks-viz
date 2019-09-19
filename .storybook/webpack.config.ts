import { default as CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
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

  const plugins = bioblocksConfig.plugins
    ? bioblocksConfig.plugins.filter(
        plugin =>
          plugin instanceof CleanWebpackPlugin === false &&
          // plugin instanceof CopyWebpackPlugin === false &&
          plugin instanceof HtmlWebpackPlugin === false,
      )
    : [new MiniCssExtractPlugin()];
  if (storybookConfig.module && storybookConfig.plugins && bioblocksConfig.module && bioblocksConfig.module.rules) {
    storybookConfig.module.rules = [...bioblocksConfig.module.rules];
    storybookConfig.optimization = bioblocksConfig.optimization;
    storybookConfig.plugins.push(new MiniCssExtractPlugin(), ...plugins);
    storybookConfig.resolve = {
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

    return storybookConfig;
  }

  return bioblocksConfig;
};
