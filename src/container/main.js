import React from 'react'
import Construction from '../component/commonUtil/Initialize'
import Responsive from "../component/userAgent/Responsive"
import Default from '../component/userAgent/Default'
import Client from '../component/commonUtil/Client'
import CSSTransitionGroup from 'react-addons-transition-group'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
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
                            type: 'audio/mpeg3'
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
                    }).catch((e) => {
                        throw new e
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
     * @param {*} recession 
     */
    operationUi(e, recession = null) {
        // Each declaration
        const parentId = e.target.className === 'img_content' ? e.target.id : e.target.parentElement.id
        const parent = document.querySelector(`#${parentId}`)
        const playBtn = parent.querySelector('.test')
        const pauseBtn = parent.querySelector('.p_test')
        const border = parent.querySelector('.border_bg')
        const audio = parent.querySelector('.notificationTone')

        console.log(parent, audio)

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
                if (typeof audio.src !== 'undifined') {
                    setTimeout(() => Responsive.operationAudio(audio, false, phone_btn), 300)
                }
                border.style.opacity = '0'
                return eval(`this.state.${parentId}.ui_touch_flag = false`)
            }

            // Event Handler processing
            if (eval(`this.state.${parentId}.ui_touch_flag`)) {
                pauseBtn.style.opacity = '1'
                Responsive.operationAudio(audio, false, phone_btn)

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
                    Responsive.operationAudio(audio, true, phone_btn)
                } else {
                    Responsive.operationAudio(audio, true, phone_btn, true)
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
                if (typeof audio.src !== 'undifined') {
                    setTimeout(() => Default.operationAudio(audio, false), 300)
                }
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
                    Default.operationAudio(audio, true, true)
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
        let loading = this.state.loadFlag
        let initFlag = this.initFlag
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
                <main className="main_container">
                    <div className="media_content">
                        {bundle}
                    </div>
                    <div className="ui_content">
                        <span className="content_name">Nine</span>
                    </div>
                </main>
            )
        } else {
            return (
                <div>Loding中</div>
            )
        }
    }
}
