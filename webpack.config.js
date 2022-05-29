const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dotenvWebpackPlugin = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const prod = 'production'
const dev = 'development'

const assets = { input: path.resolve(__dirname, './src/assets'),
  output: path.resolve(__dirname, './dist/assets')
}

module.exports = {
  mode: prod,
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './ ')
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }      
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.html')
    }),
    new dotenvWebpackPlugin({
      path: "./.env",
      safe: true
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyPlugin({
      patterns:[
        {from: assets.input, to: assets.output}
      ]
    })
  ]
}