import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

// tslint:disable-next-line:no-relative-imports
import * as generateCommonConfig from '../webpack.bioblocks-common';

const prodConfig: webpack.Configuration = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

module.exports = (env: webpack.Compiler.Handler, argv: webpack.Configuration) => {
  // @ts-ignore
  // tslint:disable-next-line: no-unsafe-any
  const mergedConfig = merge(generateCommonConfig(env, argv), prodConfig);

  if (mergedConfig.module && mergedConfig.module.rules) {
    mergedConfig.module.rules = [
      ...mergedConfig.module.rules.filter((moduleRule: webpack.RuleSetRule) => {
        if (moduleRule.test && moduleRule.test.toString().localeCompare('/\\.tsx?$/') === 0) {
          return false;
        }

        return true;
      }),
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.publish.json'),
            },
          },
        ],
      },
    ];
  }

  // mergedConfig.externals = getWebpackPublishExternals();
  mergedConfig.entry = getWebpackPublishEntry();
  mergedConfig.optimization = getWebpackPublishOptimizations(mergedConfig);
  // @ts-ignore
  mergedConfig.output = getWebpackPublishOutput();

  return mergedConfig;
};

const getWebpackPublishEntry = () => ({
  'bioblocks-frame': path.resolve(__dirname, '../frames/BBFrame.tsx'),
  'bioblocks-viz': path.resolve(__dirname, '../src/index.ts'),
});

const getWebpackPublishOptimizations = (config: webpack.Configuration) => {
  // TODO import OptimizationSplitChunksOptions from webpack declaration...
  const optimization: webpack.Options.Optimization = {
    ...config.optimization,
  };

  optimization.splitChunks = {
    name: false,
  };

  return optimization;
};

const getWebpackPublishOutput = () => ({
  filename: (chunkData: { chunk: { name: string } }) => {
    return chunkData.chunk.name === 'bioblocks-viz' ? 'index.js' : 'bioblocks-frame.js';
  },
  libraryExport: '',
  // Exporting as UMD allows bioblocks to be used in CommonJS, AMD, and as global variable.
  libraryTarget: 'umd' as const,
  path: path.resolve(__dirname, '../lib'),
});

const getWebpackPublishExternals = () => ({
  // Commonjs and commonjs2 are slightly different:
  // https://github.com/webpack/webpack/issues/1114
  react: {
    amd: 'React',
    commonjs: 'react',
    commonjs2: 'react',
    root: 'React',
  },
  'react-dom': {
    amd: 'ReactDOM',
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    root: 'ReactDOM',
  },
});
