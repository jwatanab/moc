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

        if (!this.main.asset.NODELIST_LENGTH)
            this.main.asset.NODELIST_LENGTH = document.querySelectorAll(`.${this.main.asset.audioName}`).length - 1

        const target = real.querySelector('.img')
        if (!direction) {
            this.main.operationUi({ target: target })
        } else if (direction === 'right') {
            this.main.asset.direction = 'right'
            this.main.slideController({ target: target })
        } else if (direction === 'left') {
            this.main.asset.direction = 'left'
            this.main.slideController({ target: target })
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