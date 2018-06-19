let base = require('./webpack.base');
let merge = require('webpack-merge');
let variable=require("./var");

module.exports = merge(base, {
    output: {
        filename: "[name].umd.js",
        path: variable.DIST,
        library: "Rio",
        libraryTarget: "umd"
    },
    plugins: [
        
    ]
});


