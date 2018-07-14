import React from 'react'
import Construction from '../component/commonUtil/Initialize'
import Header from '../component//Header'
import Auxiliary from '../component//Auxiliary'
import Responsive from '../component/userAgent/Responsive'
import Default from '../component/userAgent/Default'
import Client from '../component/commonUtil/Client'
import Loding from '../component/userAgent/Loding'
import ast from '../component/Asset/Ast'
import { VelocityTransitionGroup } from 'velocity-react'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loadFlag: false, }
        this.initData = null
    }

    componentWillMount() {
        Client.commonRequest(ast.url.init)
            .then((res) => {
                this.initData = res
                ast.NODELIST_LENGTH = this.initData.length - 1

                Object.keys(this.initData).map(i => {
                    Promise.all([
                        Client.toUrl({
                            url: ast.url.img,
                            request_name: this.initData[i].audioName,
                            type: ast.extension.img
                        }),
                        Client.toUrl({
                            url: ast.url.audio,
                            request_name: this.initData[i].imgName,
                            type: ast.extension.audio
                        })
                    ]).then((res) => {
                        Object.keys(res).map(i => this.state[res[i].excs] = res[i].url)
                        if (!this.state.loadFlag) this.setState({ loadFlag: true }) // shouldComponentUpdate呼び出し
                    }).catch((e) => { throw e })
                })
            })
    }

    shouldComponentUpdate() {
        const canvas = document.querySelector(ast.canvasElm)
        if (canvas) {
            canvas.style.transition = ast.css.fdOutVal
            canvas.style.opacity = ast.css.noneVal
            setTimeout(() => this.setState({}), 700) // render呼びだし
        }
        return this.state.loadFlag
    }

    /**
     * @param {TouchEvent} e 
     */
    getPosition(e) {
        ast.position = e.touches[0].pageX
        ast.direction = ''
    }

    /**
     * @param {TouchEvent} e 
     */
    setPosition(e) {
        if (ast.position - e.touches[0].pageX > ast.MOVE_LKEY) {
            ast.direction = ast.css.dircLft
        } else if (ast.position - e.touches[0].pageX < ast.MOVE_RKEY) {
            ast.direction = ast.css.dircRgt
        }
    }

    /**
     * @param {HTMLDivElement} current 
     */
    slideController(e) {
        const currentId = e.target.className === ast.imgContent ? e.target.id : e.target.parentElement.id
        const current = document.querySelector(`#${currentId}`)
        const currentIndex = parseInt(current.dataset.index)
        const viewText = document.querySelector(`.${ast.contentName}`)

        if (ast.direction === ast.css.dircRgt)
            if (currentIndex === ast.NODELIST_LENGTH)
                return alert('max')

        if (ast.direction === ast.css.dircLft)
            if (currentIndex === 0)
                return alert("min")

        const currentParent = current.closest(`.${ast.audioName}`)

        let
            SLIDE_RKEY = null,
            SLIDE_LKEY = null,
            INCREMENT = null

        if (ast.direction === ast.css.dircRgt) {
            SLIDE_RKEY = ast.slideval
            SLIDE_LKEY = `-${ast.slideval}`
            INCREMENT = 1
        } else if (ast.direction === ast.css.dircLft) {
            SLIDE_RKEY = `-${ast.slideval}`
            SLIDE_LKEY = ast.slideval
            INCREMENT = -1
        } else {
            return false
        }

        const sibling = document.querySelector(`[data-index="${currentIndex + INCREMENT}"]`)
        const siblingParent = sibling.closest(`.${ast.audioName}`)
        const name = siblingParent.dataset.name

        current.style.opacity = ast.css.noneVal
        current.style.left = SLIDE_RKEY
        setTimeout(() => {
            currentParent.style.display = ast.noneName
            currentParent.className = ast.audioName
            current.display = ast.noneName
            sibling.style.opacity = ast.css.noneVal
            siblingParent.className = `${ast.audioName} ${ast.blckName} ${ast.curtName}`
            siblingParent.style.display = ast.blckName
            viewText.innerHTML = name
            setTimeout(() => {
                sibling.style.display = ast.blckName
                sibling.style.left = SLIDE_LKEY
                setTimeout(() => {
                    sibling.style.opacity = ast.css.dispVal
                    sibling.style.left = ast.css.nonePxVal
                }, 100)
            })
        }, 500)
    }

    /**
     * @param {SyntheticEvent} e
     */
    playHandler(e) {
        const audioList = document.querySelectorAll(ast.audioElm)
        for (let i = 0; i < audioList.length; i++)
            if (audioList[i] !== e.target)
                this.operationUi({ target: audioList[i] }, true)
    }

    /**
     * @param {TouchEvent} e 
     * @param {boolean} recession 説明
     */
    operationUi(e, recession = null) {
        // Each declaration
        const parentId = e.target.className === ast.imgContent ? e.target.id : e.target.parentElement.id
        const parent = document.querySelector(`#${parentId}`)
        const playBtn = parent.querySelector('.test')
        const pauseBtn = parent.querySelector('.p_test')
        const border = parent.querySelector('.border_bg')
        const audio = parent.querySelector('.notificationTone')

        // Individual processing
        if (typeof this.state[parentId] === 'undefined') {
            this.state[parentId] = {
                ui_touch_flag: false,
                operation_flag: false
            }
        }

        if (Responsive.isSupport()) {
            // It saves the music element
            if (recession) {
                Responsive.operationAudio(audio, false)
                border.style.opacity = ast.css.noneVal
                return this.state[parentId].ui_touch_flag = false
            }

            // Event Handler processing
            if (this.state[parentId].ui_touch_flag) {
                pauseBtn.style.opacity = ast.css.dispVal
                Responsive.operationAudio(audio, false)

                setTimeout(() => {
                    pauseBtn.style.transition = ast.css.utlTrsnVal
                    pauseBtn.style.opacity = ast.css.noneVal

                    setTimeout(() => pauseBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.noneVal

                this.state[parentId].ui_touch_flag = false
            } else {
                // init Event Handler
                if (this.state[parentId].operation_flag)
                    playBtn.style.opacity = ast.css.dispVal
                Responsive.operationAudio(audio, true)
                this.state[parentId].operation_flag = true

                setTimeout(() => {
                    playBtn.style.transition = ast.css.utlTrsnVal
                    playBtn.style.opacity = ast.css.noneVal

                    setTimeout(() => playBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.dispVal

                this.state[parentId].ui_touch_flag = true
            }
        } else {
            // It saves the music element
            if (recession) {
                Default.operationAudio(audio, false)
                border.style.opacity = ast.css.noneVal
                return this.state[parentId].ui_touch_flag = false
            }

            // Event Handler processing
            if (this.state[parentId].ui_touch_flag) {
                pauseBtn.style.opacity = ast.css.dispVal
                Default.operationAudio(audio, false)

                setTimeout(() => {
                    pauseBtn.style.transition = ast.css.utlTrsnVal
                    pauseBtn.style.opacity = ast.css.noneVal

                    setTimeout(() => pauseBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.noneVal

                this.state[parentId].ui_touch_flag = false
            } else {
                // init Event Handler
                if (this.state[parentId].operation_flag)
                    playBtn.style.opacity = ast.css.noneVal
                Default.operationAudio(audio, true)
                this.state[parentId].operation_flag = true

                setTimeout(() => {
                    playBtn.style.transition = ast.css.utlTrsnVal
                    playBtn.style.opacity = ast.css.noneVal

                    setTimeout(() => playBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.dispVal

                this.state[parentId].ui_touch_flag = true
            }
        }
    }

    render() {
        let content = this.initData
        let bundle

        if (content) {
            bundle = Object.keys(this.initData).map((i, c, o) => {
                return Construction(
                    this.initData[i].audioName,
                    this.initData[i].imgName,
                    this,
                    c,
                    this.state[this.initData[i].imgName],
                    this.state[this.initData[i].audioName]
                )
            })
            return (
                <div>
                    <Header />
                    <main className="main_container">
                        <div className="media_content">
                            {bundle}
                        </div>
                        <div className="ui_content">
                            <span className="content_name">Nine</span>
                        </div>
                    </main>
                    <Auxiliary />
                </div>
            )
        } else {
            return (
                <VelocityTransitionGroup
                    runOnMount={true}
                    enter={{
                        animation: 'fadeIn',
                        stagger: 100,
                    }}
                    leave={{
                        animation: 'fadeOut',
                        stagger: 700,
                    }}>
                    <Loding />
                </VelocityTransitionGroup>
            )
        }
    }
}
