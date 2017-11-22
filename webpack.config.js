const path =  require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let config = {
    entry: {
        js: "./index.js"
    },
    output: {
        filename: './dist/aframe-3d-calendar-component.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, // files ending with .js
                exclude: /node_modules/, // exclude the node_modules directory
                loader: "babel-loader" // use this (babel-core) loader
            }
        ]
    },
    plugins: [

    ]
};

module.exports = config;

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin() // call the uglify plugin
    );
}