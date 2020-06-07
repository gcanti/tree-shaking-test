const pathHelpers = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  mode: "production",
  optimization: {
    usedExports: true,
    minimizer: [new TerserPlugin({ terserOptions: { mangle: false } })]
  },
  entry: pathHelpers.join(__dirname, "./lib/index.js"),
  output: {
    path: pathHelpers.join(__dirname, "./target"),
    filename: "webpack.js"
  }
};

module.exports = config;
