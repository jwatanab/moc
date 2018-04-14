import webpack from 'webpack'

export default {
    context: __dirname + '/src',
    entry: {
        javascript: './index.js',
    },

    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js',
    },

    rules: [
        {
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                },
            }],
        },
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            },
        ],
        devtool: '#source-map'
    }
}