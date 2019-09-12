import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
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
    return {
      ...config,
      module: {
        rules: [
          ...baseConfig.module.rules,
          {
            include: path.resolve(__dirname, 'assets'),
            loaders: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
            ],
            test: /\.css?$/,
          },
          {
            include: path.resolve(__dirname, '../assets'),
            test: /\.(woff(2)?|ttf|png|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
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
        ],
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
  }

  return baseConfig;
};
