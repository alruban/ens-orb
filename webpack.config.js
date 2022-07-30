const path = require('path');
const mode = process.env.NODE_ENV || "development";

const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: mode,

  entry: path.resolve(__dirname, './src/index.js'),

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],

  module: {
    rules: [
      {
        test: /\.(s[ac]|c|pc)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
              publicPath: "",
            },
          },
          "css-loader",
          "postcss-loader"
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'svgs/[name][ext]'
        }
      },
      {
        test: /\.(json)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'json/[name][ext]'
        }
      },
      {
        test: /\.(xml)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'xml/[name][ext]'
        }
      },
    ],
  },

  devtool: "source-map",

  resolve: {
    extensions: ['*', '.js', '.jsx'],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url")
    }
  },

  entry: './src/index.js',

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    static: path.resolve(__dirname, './dist'),
  },
};
