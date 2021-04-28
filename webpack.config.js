/* eslint-disable */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const TerserWebpackPlugin = require('terser-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

/* eslint-enable */

const isDev = process.env.NODE_ENV === 'development';
const isProd = ! isDev;


module.exports = {

  entry: {
    main: path.resolve(__dirname, 'src/ts/index.ts'),
  },

  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  devtool: isDev ? 'source-map' : false,

  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserWebpackPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all'
    }
  },

  resolve: {
    extensions: ['.ts', '.js', '.json', '.scss'], // позволяют не писать указанные расширения файлов при импорте
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ts': path.resolve(__dirname, 'src/ts'),
      '@model': path.resolve(__dirname, 'src/ts/model'), // как @ во Vue. Позволяет избежать страшных путей типо '../../../post.js' (см index.js)
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    }
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      minify: {
        collapseWhitespace: isProd,
      }
    }),

    new MiniCssExtractPlugin(),

    new CleanWebpackPlugin(), // Чистит папку 'dist'

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.svg'),
          to: path.resolve(__dirname, 'dist')
        },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(ts|js)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          'file-loader'
        ]
      },
    ],
  },
};
