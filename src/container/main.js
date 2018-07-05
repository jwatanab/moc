import React from 'react'
import Construction from '../component/commonUtil/Initialize'
import Header from '../component/Header'
import Auxiliary from '../component/Auxiliary'
import Responsive from "../component/userAgent/Responsive"
import Default from '../component/userAgent/Default'
import Client from '../component/commonUtil/Client'
import Loding from '../component/userAgent/Loding'
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
            audioName: 'audio_content',
            contentName: 'content_name'
        }
    }

    componentWillMount() {
        Client.commonRequest('/init')
            .then((res) => {
                this.initData = res
                this.state.test = true
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
                                [res[i].excs]: res[i].url
                            })
                        ])
                        console.log(this.asset.NODELIST_LENGTH)
                    }).catch((e) => {
                        throw e
                    })
                })
            })
    }

    shouldComponentUpdate() {
        const canvas = document.querySelector('canvas')
        if (canvas) {
            canvas.style.transition = '1s'
            canvas.style.opacity = '0'
            setTimeout(() => {
                this.setState({
                    loadFlag: true
                })
            }, 700);
        }
        if (this.state.loadFlag) {
            this.state.loadFlag = false
            return true
        } else {
            return false
        }
    }

    /**
     * @param {TouchEvent} e 
     */
    getPosition(e) {
        this.asset.position = e.touches[0].pageX
        this.asset.direction = ''
    }

    /**
     * @param {TouchEvent} e 
     */
    setPosition(e) {
        if (this.asset.position - e.touches[0].pageX > this.asset.MOVE_LKEY) {
            this.asset.direction = 'left'
        } else if (this.asset.position - e.touches[0].pageX < this.asset.MOVE_RKEY) {
            this.asset.direction = 'right'
        }
    }

    /**
     * @param {HTMLDivElement} current 
     */
    slideController(e) {
        const currentId = e.target.className === this.asset.imgContent ? e.target.id : e.target.parentElement.id
        const current = document.querySelector(`#${currentId}`)
        const currentIndex = parseInt(current.dataset.index)
        const viewText = document.querySelector(`.${this.asset.contentName}`)

        if (this.asset.direction === 'right') {
            if (currentIndex === this.asset.NODELIST_LENGTH)
                return alert('max')
        }
        else if (this.asset.direction === 'left')
            if (currentIndex === 0) return alert("min")

        const currentParent = current.closest(`.${this.asset.audioName}`)

        let
            SLIDE_RKEY = null,
            SLIDE_LKEY = null,
            INCREMENT = null

        if (this.asset.direction === 'right') {
            SLIDE_RKEY = '400px'
            SLIDE_LKEY = '-400px'
            INCREMENT = 1
        } else if (this.asset.direction === 'left') {
            SLIDE_RKEY = '-400px'
            SLIDE_LKEY = '400px'
            INCREMENT = -1
        } else {
            return false
        }

        const sibling = document.querySelector(`[data-index="${currentIndex + INCREMENT}"]`)
        const siblingParent = sibling.closest(`.${this.asset.audioName}`)
        const name = siblingParent.dataset.name

        current.style.opacity = '0'
        current.style.left = SLIDE_RKEY
        setTimeout(() => {
            currentParent.style.display = 'none'
            currentParent.className = `${this.asset.audioName}`
            current.display = 'none'
            sibling.style.opacity = '0'
            siblingParent.className = `${this.asset.audioName} block real`
            siblingParent.style.display = 'block'
            viewText.innerHTML = name
            setTimeout(() => {
                sibling.style.display = 'block'
                sibling.style.left = SLIDE_LKEY
                setTimeout(() => {
                    sibling.style.opacity = '1'
                    sibling.style.left = '0px'
                }, 100)
            })
        }, 500)
    }

    /**
     * @param {SyntheticEvent} e
     */
    playHandler(e) {
        const audioList = document.querySelectorAll('audio')
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
        const parentId = e.target.className === 'img_content' ? e.target.id : e.target.parentElement.id
        const parent = document.querySelector(`#${parentId}`)
        const playBtn = parent.querySelector('.test')
        const pauseBtn = parent.querySelector('.p_test')
        const border = parent.querySelector('.border_bg')
        const audio = parent.querySelector('.notificationTone')

        // Individual processing
        if (eval(`typeof this.state.${parentId}`) === 'undefined') {
            eval(`this.state.${parentId} = {
                ui_touch_flag: false,
                operation_flag: false
            }`)
        }

        if (Responsive.isSupport()) {
            // It saves the music element
            if (recession) {
                border.style.opacity = '0'
                return eval(`this.state.${parentId}.ui_touch_flag = false`)
            }

            // Event Handler processing
            if (eval(`this.state.${parentId}.ui_touch_flag`)) {
                pauseBtn.style.opacity = '1'
                Responsive.operationAudio(audio, false)

                setTimeout(() => {
                    pauseBtn.style.transition = '.7s'
                    pauseBtn.style.opacity = '0'

                    setTimeout(() => pauseBtn.setAttribute('style', 'opacity: 0;'), 300)
                }, 100)
                border.style.opacity = '0'

                eval(`this.state.${parentId}.ui_touch_flag = false`)
            } else {
                // init Event Handler
                if (eval(`this.state.${parentId}.operation_flag`)) {
                    playBtn.style.opacity = '1'
                    Responsive.operationAudio(audio, true)
                } else {
                    Responsive.operationAudio(audio, true)
                    eval(`this.state.${parentId}.operation_flag = true`)
                }

                setTimeout(() => {
                    playBtn.style.transition = '.7s'
                    playBtn.style.opacity = '0'

                    setTimeout(() => playBtn.setAttribute('style', 'opacity: 0;'), 300)
                }, 100)
                border.style.opacity = '1'

                eval(`this.state.${parentId}.ui_touch_flag = true`)
            }
        } else {
            // It saves the music element
            if (recession) {
                Default.operationAudio(audio, false)
                border.style.opacity = '0'
                return eval(`this.state.${parentId}.ui_touch_flag = false`)
            }

            // Event Handler processing
            if (eval(`this.state.${parentId}.ui_touch_flag`)) {
                pauseBtn.style.opacity = '1'
                Default.operationAudio(audio, false)

                setTimeout(() => {
                    pauseBtn.style.transition = '.7s'
                    pauseBtn.style.opacity = '0'

                    setTimeout(() => pauseBtn.setAttribute('style', 'opacity: 0;'), 300)
                }, 100)
                border.style.opacity = '0'

                eval(`this.state.${parentId}.ui_touch_flag = false`)
            } else {
                // init Event Handler
                if (eval(`this.state.${parentId}.operation_flag`)) {
                    playBtn.style.opacity = '1'
                    Default.operationAudio(audio, true)
                } else {
                    Default.operationAudio(audio, true)
                    eval(`this.state.${parentId}.operation_flag = true`)
                }

                setTimeout(() => {
                    playBtn.style.transition = '.7s'
                    playBtn.style.opacity = '0'

                    setTimeout(() => playBtn.setAttribute('style', 'opacity: 0;'), 300)
                }, 100)
                border.style.opacity = '1'

                eval(`this.state.${parentId}.ui_touch_flag = true`)
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
            this.flag = true
        } else {

        }

        if (this.flag) {
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
                </div >
            )
        } else {
            return (
                <VelocityTransitionGroup
                    runOnMount={true}
                    enter={
                        {
                            animation: 'fadeIn',
                            stagger: 100,
                        }
                    }
                    leave={
                        {
                            animation: 'fadeOut',
                            stagger: 700,
                        }
                    }>
                    <Loding />
                </VelocityTransitionGroup>
            )
        }
    }
}
