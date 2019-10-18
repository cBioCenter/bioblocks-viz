"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack = require("webpack");
var merge = require("webpack-merge");
// tslint:disable-next-line:no-relative-imports
var generateCommonConfig = require("../webpack.bioblocks-common");
var prodConfig = {
    mode: 'production',
    optimization: {
        minimize: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ],
};
module.exports = function (env, argv) {
    // @ts-ignore
    // tslint:disable-next-line: no-unsafe-any
    return merge(generateCommonConfig(env, argv), prodConfig);
};
//# sourceMappingURL=webpack.prod.js.map