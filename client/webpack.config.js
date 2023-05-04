const path = require("path");
const webpack = require("webpack");
require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    filename: "main.js",
    publicPath: "/",
    path: path.resolve(__dirname, "public"),
  },

  target: "web",
  devServer: {
    port: "3000",
    static: path.resolve(__dirname, "public"),
    open: true,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: "process/browser",
      "process.env.REACT_APP_URL": JSON.stringify(process.env.REACT_APP_URL),
      "process.env.REACT_APP_FIREBASE_API_KEY": JSON.stringify(
        process.env.REACT_APP_FIREBASE_API_KEY
      ),
      "process.env.REACT_APP_FIREBASE_AUTH_DOMAIN": JSON.stringify(
        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
      ),
      "process.env.REACT_APP_FIREBASE_PROJECT_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_PROJECT_ID
      ),
      "process.env.REACT_APP_FIREBASE_STORAGE_BUCKET": JSON.stringify(
        process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
      ),
      "process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
      ),
      "process.env.REACT_APP_FIREBASE_APP_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_APP_ID
      ),
      "process.env.REACT_APP_FIREBASE_MEASUREMENT_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
      ),
    }),
  ],
};
