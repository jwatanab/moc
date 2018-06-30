import React from 'react'
import Main from '../container/main'

export default class Auxiliary extends React.Component {
    constructor(props) {
        super(props)
        this.main = new Main()
    }

    /**
     * @param {MouseEvent} e 
     */
    auxOperation(e, direction = null) {
        const real = document.querySelector('.real')
        if (!real) return

        const target = real.querySelector('.img_content')
        if (!direction) {
            /**
             * ここでスライドで操作するといろいろやっても再生から処理されるけど、ボタンでやると停止処理から入る
             * ボタンで操作したあと最後まで再生が終了するとなぜか頭から再度始め始める
             */
            this.main.operationUi({ target: target })
        } else if (direction === 'right') {
            this.main.slideAnimation(target, 'right')
        } else if (direction === 'left') {
            this.main.slideAnimation(target, 'left')
        } else {

        }
    }

    render() {
        return (
            <div className="controll_bar">
                <div className="wrapper_button">
                    <div className="prevbutton" onClick={(e) => this.auxOperation(e, 'right')}></div>
                </div>
                <div className="wrapper_button">
                    <div className="playbutton" onClick={(e) => this.auxOperation(e)}></div>
                </div>
                <div className="wrapper_button">
                    <div className="nextbutton" onClick={(e) => this.auxOperation(e, 'left')}></div>
                </div>
            </div>
        )
    }
}