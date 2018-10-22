const path = require("path")
const webpack = require("webpack")
const variable=require("./var")

module.exports = {
    context:path.resolve(__dirname,"../src"),
    entry: {
        "rio": variable.SRC+"/main.ts"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    
    module: {
        rules: [{
            test: /\.ts$/,
            use: {
                loader: "ts-loader"
            }
        }]
    }
}