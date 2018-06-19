let base = require('./webpack.base');
let merge = require('webpack-merge');
let variable=require("./var");

module.exports = merge(base, {
    output: {
        filename: "[name].js",
        path: variable.DIST,
        libraryTarget:"commonjs2"
    },
    plugins: [
    ]
});


