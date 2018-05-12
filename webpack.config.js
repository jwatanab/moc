module.exports = {
    mode: 'development',

    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: `${__dirname}/public/dist`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env', { 'modules': false }],
                                ['react']
                            ]
                        }
                    }
                ],
                exclude: /node_modules/,
            }
        ]
    }
}
