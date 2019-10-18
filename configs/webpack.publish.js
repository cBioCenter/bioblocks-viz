"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = require("path");
var webpack = require("webpack");
var merge = require("webpack-merge");
// tslint:disable-next-line:no-relative-imports
var generateCommonConfig = require("../webpack.bioblocks-common");
var prodConfig = {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ],
};
module.exports = function (env, argv) {
    // @ts-ignore
    // tslint:disable-next-line: no-unsafe-any
    var mergedConfig = merge(generateCommonConfig(env, argv), prodConfig);
    if (mergedConfig.module && mergedConfig.module.rules) {
        mergedConfig.module.rules = tslib_1.__spread(mergedConfig.module.rules.filter(function (moduleRule) {
            if (moduleRule.test && moduleRule.test.toString().localeCompare('/\\.tsx?$/') === 0) {
                return false;
            }
            return true;
        }), [
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
        ]);
    }
    mergedConfig.externals = getWebpackPublishExternals();
    mergedConfig.entry = getWebpackPublishEntry();
    mergedConfig.optimization = getWebpackPublishOptimizations(mergedConfig);
    // @ts-ignore
    mergedConfig.output = getWebpackPublishOutput();
    return mergedConfig;
};
var getWebpackPublishEntry = function () { return ({
    'bioblocks-frame': path.resolve(__dirname, '../frames/BBFrame.tsx'),
    'bioblocks-viz': path.resolve(__dirname, '../src/index.ts'),
}); };
var getWebpackPublishOptimizations = function (config) {
    // TODO import OptimizationSplitChunksOptions from webpack declaration...
    var optimization = tslib_1.__assign({}, config.optimization);
    optimization.splitChunks = {
        name: false,
    };
    return optimization;
};
var getWebpackPublishOutput = function () { return ({
    filename: function (chunkData) {
        return chunkData.chunk.name === 'bioblocks-viz' ? 'index.js' : 'bioblocks-frame.js';
    },
    libraryExport: '',
    // Exporting as UMD allows bioblocks to be used in CommonJS, AMD, and as global variable.
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../lib'),
}); };
var getWebpackPublishExternals = function () { return ({
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
}); };
//# sourceMappingURL=webpack.publish.js.map