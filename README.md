### Document

***

- 20180319

    - 概要
        - ./single.cmdでES6コンパイル対象をコマンドで動的に変更

    - BI

        - 例: ./single.cmd "対象ページ"

        - 以上のコマンドを打つとwebpack.config.babel.jsの受け取り側のjsファイルを変更

        - それに合わせて出力ファイルも変更する

        ```js

            entry: {
                javascript: './index.js', /* 動的に変更 */
            }

            output: {
                path: __dirname + '/public/dist',
                filename: 'bundle.js' /* 動的に変更 */
            }
        
        ```