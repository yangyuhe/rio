let base = require('./webpack.base');
let merge = require('webpack-merge');
let variable=require("./var");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(base, {
  output: {
    filename: "[name].umd.min.js",
    path: variable.DIST,
    library: "Rio",
    libraryTarget: "umd"
  },
  plugins: [
  ]
});


