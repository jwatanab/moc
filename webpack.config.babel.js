module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development',

    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: `${__dirname}, 'public/dist'`
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
