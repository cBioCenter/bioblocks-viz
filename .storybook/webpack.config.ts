import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as webpack from 'webpack';

// tslint:disable-next-line:no-relative-imports
import * as generateCommonConfig from '../webpack.bioblocks-common';

module.exports = async ({ config, mode }: { config: webpack.Configuration; mode: string }) => {
  // @ts-ignore
  // tslint:disable-next-line: no-unsafe-any
  const baseConfig: webpack.Configuration = generateCommonConfig((err: any, stats: any) => {
    return;
  }, config);

  if (config.module && baseConfig.module && baseConfig.module.rules) {
    const merged: webpack.Configuration = {
      ...config,
      module: {
        rules: baseConfig.module.rules,
      },
      plugins: [...config.plugins, new MiniCssExtractPlugin()],
      resolve: {
        ...config.resolve,
        ...baseConfig.resolve,
        alias:
          baseConfig.resolve && config.resolve
            ? {
                ...baseConfig.resolve.alias,
                ...config.resolve.alias,
              }
            : {},
      },
    };
    console.log(merged);

    return merged;
  }

  return baseConfig;
};
