let base = require('./webpack.base');
let merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let variable=require("./var");

module.exports = merge(base, {
    output: {
        filename: "[name].min.js",
        path: variable.DIST,
        libraryTarget:"commonjs2"
    },
    plugins: [
        
    ]
});


