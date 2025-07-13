const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env = {}) => ({
  target: "web",
  mode: env.prod ? "production" : "development",
  devtool: env.prod ? false : "cheap-module-source-map",
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    path: path.resolve(__dirname, "./dist"),
    publicPath: "",
  },
  resolve: {
    alias: {
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      vue: "@vue/runtime-dom",
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      inject: 'body',
    }),
  ],
  optimization: {
    minimize: false
  },
  devServer: {
    hot: true,
    static: {
      directory: __dirname,
    },
    client: {
      overlay: true,
    },
    devMiddleware: {
      stats: 'minimal',
    },
  },
});
