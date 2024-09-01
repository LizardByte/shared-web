const path = require('path');
const { codecovWebpackPlugin } = require("@codecov/webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let production = process.env.NODE_ENV === 'production';

let config = {
    entry: {
        'crowdin': './src/js/crowdin',
        'crowdin-web-widget': './src/js/crowdin-web-widget',
        'discord': './src/js/discord',
        'levenshtein-distance': './src/js/levenshtein-distance',
        'lizardbyte-css': './src/js/lizardbyte-css',
        'load-script': './src/js/load-script',
        'random-quote': './src/js/random-quote',
        'ranking-sorter': './src/js/ranking-sorter',
        'sleep': './src/js/sleep',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,  // this is processed last
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ["postcss-preset-env", {}],
                                ],
                            },
                        },
                    },  // this is processed first
                ],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,  // this is processed last
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ["postcss-preset-env", {}],
                                ],
                            },
                        },
                    },
                    "sass-loader",  // this is processed first
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        // Put the Codecov webpack plugin after all other plugins
        codecovWebpackPlugin({
          enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
          bundleName: "shared-web",
          uploadToken: process.env.CODECOV_TOKEN,
        }),
    ],
    resolve: {
        extensions: ['.js'],
    },
    devtool: 'inline-source-map',
    mode: "development",
    devServer: {
        static: './dist',
        watchFiles: ['src/**/*'],
    },
}

if (production) {
    config.mode = 'production';
    config.devtool = 'source-map';
}

module.exports = config;
