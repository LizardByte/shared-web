const fs = require('node:fs/promises');
const path = require('node:path');
const { codecovWebpackPlugin } = require("@codecov/webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class CopyLanguageIconsPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tapPromise('CopyLanguageIconsPlugin', async () => {
            const outputPath = path.resolve(compiler.options.output.path, 'language-icons');

            await fs.rm(outputPath, { recursive: true, force: true });
            await fs.cp(path.resolve(__dirname, 'src/language-icons'), outputPath, { recursive: true });
        });
    }
}

let production = process.env.NODE_ENV === 'production';

let config = {
    entry: {
        'crowdin': './src/js/crowdin',
        'crowdin-bootstrap-css': './src/js/crowdin-bootstrap-css',
        'crowdin-clean-jsdoc-css': './src/js/crowdin-clean-jsdoc-css',
        'crowdin-doxygen-css': './src/js/crowdin-doxygen-css',
        'crowdin-furo-css': './src/js/crowdin-furo-css',
        'crowdin-rustdoc-css': './src/js/crowdin-rustdoc-css',
        'format-number': './src/js/format-number',
        'levenshtein-distance': './src/js/levenshtein-distance',
        'lizardbyte-css': './src/js/lizardbyte-css',
        'load-script': './src/js/load-script',
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
        new CopyLanguageIconsPlugin(),
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
