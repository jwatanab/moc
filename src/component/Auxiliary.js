import React from 'react'
import ast from '../component/Asset/Ast'
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

        const real = document.querySelector(`.${ast.curtName}`)
        if (!real) return

        if (!ast.css.NODELIST_LENGTH)
            ast.css.NODELIST_LENGTH = document.querySelectorAll(`.${ast.audioName}`).length - 1

        const target = real.querySelector(`.${ast.imgName}`)
        if (!direction) {
            this.main.operationUi({ target: target })
        } else if (direction === ast.css.dircRgt) {
            ast.direction = ast.css.dircRgt
            this.main.slideController({ target: target })
        } else if (direction === ast.css.dircLft) {
            ast.direction = ast.css.dircLft
            this.main.slideController({ target: target })
        }
    }

    render() {
        return (
            <div className="controll_bar">
                <div className="wrapper_button">
                    <div className="prevbutton" onClick={(e) => this.auxOperation(e, ast.css.dircRgt)}></div>
                </div>
                <div className="wrapper_button">
                    <div className="playbutton" onClick={(e) => this.auxOperation(e)}></div>
                </div>
                <div className="wrapper_button">
                    <div className="nextbutton" onClick={(e) => this.auxOperation(e, ast.css.dircLft)}></div>
                </div>
            </div>
        )
    }
}