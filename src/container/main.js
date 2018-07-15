import React from 'react'
import Construction from '../component/commonUtil/Initialize'
import Responsive from "../component/userAgent/Responsive"
import Default from '../component/userAgent/Default'
import Client from '../component/commonUtil/Client'
import Header from '../component/Header'
import ast from "../component/Asset/Ast"
import { VelocityTransitionGroup } from 'velocity-react'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadFlag: false,
        }
        this.initData = null
        this.asset = {
            direction: '',
            MOVE_LKEY: 50,
            MOVE_RKEY: -50,
            position: null,
            NODELIST_LENGTH: null,
            contentName: 'content_name'
        }
    }

    componentWillMount() {
        Client.commonRequest('/init')
            .then((res) => {
                this.initData = res
                this.asset.NODELIST_LENGTH = this.initData.length - 1

                Object.keys(this.initData).map(i => {
                    Promise.all([
                        Client.toUrl({
                            url: '/content',
                            request_name: this.initData[i].audioName,
                            type: 'audio/mp3'
                            // type: `audio/${this.initData[i].type}`
                        }),
                        Client.toUrl({
                            url: '/main_init',
                            request_name: this.initData[i].imgName,
                            type: 'image/jpeg'
                        })
                    ]).then((res) => {
                        Object.keys(res).map(i => [
                            this.setState({
                                [res[i].audioName]: res[i].url
                            })
                        ])
                    }).catch((e) => {
                        throw e
                    })
                })
            })
    }

    componentDidMount() {

    }

    getPosition(e) {
        this.asset.position = e.touches[0].pageX
        this.asset.direction = ''
    }

    setPosition(e) {
        if (this.asset.position - e.touches[0].pageX > this.asset.MOVE_LKEY) {
            this.asset.direction = 'left'
        } else if (this.asset.position - e.touches[0].pageX < this.asset.MOVE_RKEY) {
            this.asset.direction = 'right'
        }
    }

    slideController(e) {
        const currentId = e.target.className === this.asset.imgContent ? e.target.id : e.target.parentElement.id
        const current = document.querySelector(`#${currentId}`)
        const viewText = document.querySelector(`.${this.asset.contentName}`)
        const currentIndex = parseInt(current.dataset.index)
        if (this.asset.direction == 'right') {
            if (currentIndex === this.asset.NODELIST_LENGTH) return alert('最大件数')

            this.slideAnimation(current, viewText, 'right')

        } else if (this.asset.direction == 'left') {
            if (currentId === 0) return alert("零")

            this.slideAnimation(current, viewText, 'left')
        } else {
        }
    }

    /**
     * @param {HTMLElement} current 
     * @param {HTMLElement} viewText 
     * @param {String} direction 
     */
    slideAnimation(current, viewText, direction) {

        const currentId = parseInt(current.dataset.index)
        const currentParent = current.closest('.audio_content')

        let
            SLIDE_RKEY = null,
            SLIDE_LKEY = null,
            INCREMENT = null

        if (direction === 'right') {
            SLIDE_RKEY = '400px'
            SLIDE_LKEY = '-400px'
            INCREMENT = 1
        } else if (direction === 'left') {
            SLIDE_RKEY = '-400px'
            SLIDE_LKEY = '400px'
            INCREMENT = -1
        } else {
            return false
        }

        const next = document.querySelector(`[data-index="${currentId + INCREMENT}"]`)
        const nextParent = next.closest('.audio_content')
        const name = nextParent.dataset.name

        current.style.opacity = '0'
        current.style.left = SLIDE_RKEY
        setTimeout(() => {
            currentParent.style.display = 'none'
            current.display = 'none'
            next.style.opacity = '0'
            nextParent.className = 'audio_content block'
            nextParent.style.display = 'block'
            viewText.innerHTML = name
            setTimeout(() => {
                next.style.display = 'block'
                next.style.left = SLIDE_LKEY
                setTimeout(() => {
                    next.style.opacity = '1'
                    next.style.left = '0px'
                }, 100)
            })
        }, 500)
    }

    /**
     * @param {*} e
     * @return void 
     */
    playHandler(e) {
        const audioList = document.querySelectorAll('audio')
        for (let i = 0; i < audioList.length; i++)
            if (audioList[i] !== e.target) {
                this.operationUi({ target: audioList[i] }, true)
                console.log('!if')
            } else {
                console.log('if')
            }
    }

    /**
     * 
     * @param {*} e 
     * @return void
     */
    endedHandler(e) {
        console.log('ended = ' + e.target)
        this.operationUi(e, true)
    }

    /**
    * @param {TouchEvent} e 
    * @param {boolean} recession
    */
    operationUi(e, recession = null) {
        // Each declaration
        const parentId = e.target.className === ast.imgContent ? e.target.id : e.target.parentElement.id
        const parent = document.querySelector(`#${parentId}`)
        const playBtn = parent.querySelector('.test')
        const pauseBtn = parent.querySelector('.p_test')
        const border = parent.querySelector('.border_bg')
        const audio = parent.querySelector('.notificationTone')

        // Set the ui operation for the attribute
        if (typeof parent.dataset.isCilcked === ast.undefVal &&
            typeof parent.dataset.isInitialized === ast.undefVal) {
            parent.dataset.isCilcked = 0
            parent.dataset.isInitialized = 0
        }


        if (Responsive.isSupport()) {
            // It stop the music
            if (recession) {
                Responsive.operationAudio(audio, false)
                border.style.opacity = ast.css.noneVal
                parent.style.transform = "scale(1.0, 1.0)"
                return parent.dataset.isCilcked = 0
            }

            // Event Handler processing
            if (parseInt(parent.dataset.isCilcked)) {
                pauseBtn.style.opacity = ast.css.dispVal
                Responsive.operationAudio(audio, false)

                setTimeout(() => {
                    pauseBtn.style.transition = ast.css.utlTrsnVal
                    pauseBtn.style.opacity = ast.css.noneVal
                    parent.style.transform = "scale(1.0, 1.0)"

                    setTimeout(() =>
                        pauseBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.noneVal

                parent.dataset.isCilcked = 0
            } else {
                // fade out the play button
                if (parseInt(parent.dataset.isInitialized))
                    playBtn.style.opacity = ast.css.dispVal
                Responsive.operationAudio(audio, true)
                parent.dataset.isInitialized = 1

                setTimeout(() => {
                    playBtn.style.transition = ast.css.utlTrsnVal
                    playBtn.style.opacity = ast.css.noneVal

                    setTimeout(() =>
                        playBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.dispVal
                parent.style.transform = "scale(1.1, 1.1)"
                console.log(`parent.style.transform = "scale(1.1, 1.1)"`)

                parent.dataset.isCilcked = 1
            }
        } else {
            // It saves the music element
            if (recession) {
                Default.operationAudio(audio, false)
                border.style.opacity = ast.css.noneVal
                return parent.dataset.isCilcked = 0
            }

            // Event Handler processing
            if (parseInt(parent.dataset.isCilcked)) {
                pauseBtn.style.opacity = ast.css.dispVal
                Default.operationAudio(audio, false)

                setTimeout(() => {
                    pauseBtn.style.transition = ast.css.utlTrsnVal
                    pauseBtn.style.opacity = ast.css.noneVal

                    setTimeout(() =>
                        pauseBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.noneVal

                parent.dataset.isCilcked = 0
            } else {
                // init Event Handler
                if (parseInt(parent.dataset.isInitialized))
                    playBtn.style.opacity = ast.css.noneVal
                Default.operationAudio(audio, true)
                parent.dataset.isInitialized = 1

                setTimeout(() => {
                    playBtn.style.transition = ast.css.utlTrsnVal
                    playBtn.style.opacity = ast.css.noneVal

                    setTimeout(() =>
                        playBtn.setAttribute(ast.styleAttr, ast.css.setNoneOpcty), 300)
                }, 100)
                border.style.opacity = ast.css.dispVal

                parent.dataset.isCilcked = 1
            }
        }
    }

    render() {
        let content = this.initData
        let bundle
        let contentName

        if (content) {
            bundle = Object.keys(this.initData).map((i, c, o) => {
                if (c == 0) contentName = this.initData[i].audioName
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
                            <span className="content_name">{contentName}</span>
                        </div>
                    </main>
                    {/* <Auxiliary /> */}
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
                    Loding
                    {/* <Loding /> */}
                </VelocityTransitionGroup>
            )
        }
    }
}
