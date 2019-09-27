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

  if (storybookConfig.module && storybookConfig.plugins && bioblocksConfig.module && bioblocksConfig.module.rules) {
    storybookConfig.module.rules = getModuleRules(bioblocksConfig.module.rules);
    storybookConfig.optimization = bioblocksConfig.optimization;
    storybookConfig.plugins.push(new MiniCssExtractPlugin(), ...getPlugins(bioblocksConfig));
    storybookConfig.resolve = getAliases(storybookConfig, bioblocksConfig);

    return storybookConfig;
  }

  return bioblocksConfig;
};

const getPlugins = (bioblocksConfig: webpack.Configuration) => {
  return bioblocksConfig.plugins
    ? bioblocksConfig.plugins.filter(
        plugin =>
          plugin instanceof CleanWebpackPlugin === false &&
          // plugin instanceof CopyWebpackPlugin === false &&
          plugin instanceof HtmlWebpackPlugin === false,
      )
    : [new MiniCssExtractPlugin()];
};

const getModuleRules = (bioblocksRules: webpack.RuleSetRule[]): webpack.RuleSetRule[] => {
  return [...bioblocksRules];
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
