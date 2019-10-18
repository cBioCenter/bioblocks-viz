"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CopyWebpackPlugin = require("copy-webpack-plugin");
var webpack = require("webpack");
var merge = require("webpack-merge");
// tslint:disable-next-line:no-relative-imports
var generateCommonConfig = require("../webpack.bioblocks-common");
var devConfig = {
    devServer: {
        contentBase: './dist',
        hot: true,
        index: 'index.html',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            {
                from: './datasets',
                to: './datasets',
                toType: 'dir',
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: './assets',
                ignore: ['*.pdf'],
                to: './assets',
                toType: 'dir',
            },
        ]),
    ],
};
module.exports = function (env, argv) {
    // @ts-ignore
    // tslint:disable-next-line: no-unsafe-any
    return merge(generateCommonConfig(env, argv), devConfig);
};
//# sourceMappingURL=webpack.dev.js.map