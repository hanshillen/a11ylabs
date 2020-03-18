const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: './src/index.tsx',

    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss']
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.module\.s(a|c)ss$/,
                loader: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module\.s(a|c)ss$/,
                loader: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            },

            // {
            //     test: /\.(s?css)$/,
            //     use: [
            //         {
            //             loader: MiniCssExtractPlugin.loader,
            //             options: {
            //                 // only enable hot in development
            //                 hmr: isDev,
            //                 // if hmr does not work, this is a forceful method.
            //                 reloadAll: true,
            //             },
            //         },
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 importLoaders: 2,
            //                 modules: {
            //                     localIdentName: '[local]__[emoji][hash:5]'
            //                 }
            //             }
            //         },
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 sourceMap: true,
            //                 sassOptions: {
            //                     outputStyle: 'expanded'
            //                 }
            //             }
            //         }
            //     ],
            //     include: /\.module\.s?css/
            // },
            // {
            //     test: /\.(s?css)$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 sourceMap: true,
            //                 sassOptions: {
            //                     outputStyle: 'expanded'
            //                 }
            //             }
            //         }
            //     ],
            //     exclude: /\.module\.s?css/
            // }
        ]
    },
    devtool: "source-map",
    optimization: {
        minimizer: [new TerserJSPlugin({
            sourceMap: true
        }), new OptimizeCSSAssetsPlugin({
            sourceMap: true
        })],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
        })
    ]
};