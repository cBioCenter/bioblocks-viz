import * as path from 'path';

module.exports = [
  {
    name: '@storybook/preset-typescript',
    options: {
      tsDocgenLoaderOptions: {
        tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
      },
      tsLoaderOptions: {
        configFile: path.resolve(__dirname, 'tsconfig.json'),
        transpileOnly: true,
      },
    },
  },
  {
    name: '@storybook/addon-docs/react/preset',
    options: {
      babelOptions: {},
      configureJSX: true,
      sourceLoaderOptions: {
        parser: 'typescript',
      },
    },
  },
];
