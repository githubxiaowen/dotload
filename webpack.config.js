const webpack = require('webpack')
module.exports = {
    entry: './index',
    output: {
        filename: 'node-upload.js',
        libraryTarget: "commonjs2",
    },
    // don't know what happend really
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}