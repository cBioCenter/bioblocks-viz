"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var tsconfig_paths_webpack_plugin_1 = require("tsconfig-paths-webpack-plugin");
var webpack = require("webpack");
var path = require("path");
// tslint:disable-next-line: export-name
exports.generateCommonConfig = function (env, argv) { return ({
    entry: {
        bioblocks: './frames/BBFrame.tsx',
        example: './docs/example/index.tsx',
    },
    module: {
        rules: getCommonWebpackModuleRules(argv),
    },
    optimization: getCommonWebpackOptimizations(),
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    performance: {
        assetFilter: function (assetFilename) {
            var e_1, _a;
            var allowedLargeAssetExtensions = ['png', 'svg'];
            try {
                for (var allowedLargeAssetExtensions_1 = tslib_1.__values(allowedLargeAssetExtensions), allowedLargeAssetExtensions_1_1 = allowedLargeAssetExtensions_1.next(); !allowedLargeAssetExtensions_1_1.done; allowedLargeAssetExtensions_1_1 = allowedLargeAssetExtensions_1.next()) {
                    var ext = allowedLargeAssetExtensions_1_1.value;
                    if (assetFilename.endsWith(ext)) {
                        return false;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (allowedLargeAssetExtensions_1_1 && !allowedLargeAssetExtensions_1_1.done && (_a = allowedLargeAssetExtensions_1.return)) _a.call(allowedLargeAssetExtensions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        },
    },
    plugins: getCommonWebpackPlugins(),
    resolve: {
        alias: {
            ngl: path.resolve(__dirname, './node_modules/ngl/dist/ngl.esm.js'),
            'plotly.js/lib/index': path.resolve(__dirname, './node_modules/plotly.js/dist/plotly.min.js'),
            'plotly.js/lib/index-gl2d': path.resolve(__dirname, './node_modules/plotly.js/dist/plotly-gl2d.min.js'),
            'plotly.js/lib/index-gl3d': path.resolve(__dirname, './node_modules/plotly.js/dist/plotly-gl3d.min.js'),
            react: path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        },
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        modules: [path.join(__dirname, 'src'), path.join(__dirname, 'types'), path.resolve('node_modules'), 'node_modules'],
        plugins: [new tsconfig_paths_webpack_plugin_1.TsconfigPathsPlugin()],
    },
}); };
var getCommonWebpackModuleRules = function (argv) { return [
    {
        include: [
            path.resolve(__dirname, 'assets/semantic.flat.min.css'),
            path.resolve(__dirname, 'node_modules/rc-slider'),
            path.resolve(__dirname, 'node_modules/@storybook/addon-info/dist/components/PropTable/style.css'),
        ],
        test: /\.css$/,
        use: [
            'style-loader',
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: process.env.NODE_ENV === 'development',
                },
            },
            'css-loader',
        ],
    },
    {
        test: /\.tsx?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'configs', argv.mode === 'development' ? 'tsconfig.dev.json' : 'tsconfig.webpack.json'),
                    context: __dirname,
                },
            },
            {
                loader: 'react-docgen-typescript-loader',
            },
        ],
    },
    {
        include: [path.resolve(__dirname, 'node_modules/plotly.js')],
        // Needed for Plotly.js: https://github.com/plotly/plotly.js#building-plotlyjs-with-webpack
        loader: 'ify-loader',
        test: /\.js$/,
    },
    {
        include: [path.resolve(__dirname, 'assets')],
        test: /\.(woff(2)?|ttf|png|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
            {
                loader: "image-webpack-loader",
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
    {
        // We handle anatomogram assets differently because anatomogram component expects exact sizes.
        include: [path.resolve(__dirname, 'node_modules/anatomogram')],
        test: /\.(woff(2)?|ttf|png|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/anatomogram',
                },
            },
        ],
    },
]; };
var getCommonWebpackOptimizations = function () {
    return {
        runtimeChunk: false,
        splitChunks: {
            automaticNameDelimiter: '~',
            cacheGroups: {
                styles: {
                    chunks: 'all',
                    enforce: true,
                    name: 'styles',
                    test: /\.css$/,
                },
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/,
                },
            },
            chunks: 'all',
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            maxSize: 0,
            minChunks: 1,
            minSize: 30000,
            name: true,
        },
    };
};
var getCommonWebpackPlugins = function () { return [
    new clean_webpack_plugin_1.default(),
    new HtmlWebpackPlugin({
        chunks: ['example'],
        favicon: 'assets/favicons/favicon.ico',
        filename: 'index.html',
        inject: true,
        template: './docs/example/index.html',
        title: 'Bioblocks Visualization Library',
    }),
    new HtmlWebpackPlugin({
        chunks: ['bioblocks'],
        favicon: 'assets/favicons/favicon.ico',
        filename: 'bioblocks.html',
        inject: true,
        template: './frames/bioblocks.html',
    }),
    new CopyWebpackPlugin([
        {
            from: './datasets',
            ignore: ['*.pdf'],
            to: './datasets',
            toType: 'dir',
        },
    ]),
    new CopyWebpackPlugin([
        {
            from: './SPRING_dev',
            to: './SPRING',
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
    new MiniCssExtractPlugin({
        chunkFilename: '[id].css',
        filename: '[name].[contenthash:8].css',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
]; };
module.exports = function (env, argv) {
    return exports.generateCommonConfig(env, argv);
};
//# sourceMappingURL=webpack.bioblocks-common.js.map