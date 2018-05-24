import React from 'react'
import assert, { throws } from 'assert'
import request from 'superagent'
import Rcslider from 'rc-slider'
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
        }
    }

    componentWillMount() {
        Client.commonRequest('/initilize')
            .then((e) => {
                // Init AudioElement TouchEventHandler
                Array.from(document.querySelectorAll('.audio_content'))
                    .map((i, c) => i.dataset.name = e[c])
            })
    }

    componentDidMount() {
        // Init Image Front
        Array.from(document.querySelectorAll('.img'))
            .map(imgElement => {
                request.post('/main_init')
                    .responseType('arraybuffer')
                    .query({ name: imgElement.id })
                    .send(null)
                    .end((err, res) => {
                        assert.ifError(err)
                        const blob = new Blob([res.body], { type: 'image/png' })
                        const url = URL.createObjectURL(blob)
                        imgElement.src = url
                    })
            })

        // Init AudioElement TouchEventHandler
        Array.from(document.querySelectorAll('.audio_content'))
            .map((audioContent, procIndex) => {

                const imgContent = audioContent.querySelector('.img_content')

                const NODELIST_LENGTH = (document.querySelectorAll('.audio_content').length - 1),
                    MOVE_LKEY = 50,
                    MOVE_RKEY = -50

                let direction = null,
                    position = null

                /*
                const last_parant_element = document.querySelectorAll('.audio_content')[this_length]
                const last_element = last_parant_element.querySelector('.img_content')
                */

                imgContent.dataset.index = procIndex

                if (procIndex !== 0) {
                    audioContent.className = `${audioContent.getAttribute('class')} none`
                }

                imgContent.addEventListener('touchstart', (e) => {
                    position = e.touches[0].pageX
                    direction = ''
                }, { passive: false })

                imgContent.addEventListener('touchmove', (e) => {
                    if (position - e.touches[0].pageX > MOVE_LKEY) {
                        direction = 'left'
                    } else if (position - e.touches[0].pageX < MOVE_RKEY) {
                        direction = 'right'
                    }
                }, { passive: false })

                imgContent.addEventListener('touchend', (e) => {
                    const currentId = e.target.className === 'img_content' ? e.target.id : e.target.parentElement.id
                    const current = document.querySelector(`#${currentId}`)
                    const viewText = document.querySelector('.content_name')
                    const currentIndex = parseInt(current.dataset.index)
                    if (direction == 'right') {
                        if (currentIndex === NODELIST_LENGTH) return alert('最大件数')

                        this.slideAnimation(current, viewText, 'right')

                    } else if (direction == 'left') {
                        if (currentId === 0) return alert("零")

                        this.slideAnimation(current, viewText, 'left')


                    } else {
                        console.log(e.target)
                    }
                }, { passive: false })
            })

        const audio_list = document.querySelectorAll('audio')

        // Init AudioElement EventHandler
        for (let j = 0; j < audio_list.length; j++) {
            audio_list[j].addEventListener('play', (e) => {
                for (let i = 0; i < audio_list.length; i++)
                    if (audio_list[i] !== e.target)
                        this.operationUi({ target: audio_list[i] }, true)
            })

            audio_list[j].addEventListener('ended', (e) => {
                this.operationUi({ target: audio_list[j] }, true)
            })
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
        return (
            <main className="main_container">
                <div className="media_content">
                    <div className="audio_content">
                        <div className="content_bar">
                            <div className="touch_ui">
                                <div className="img_content" id="node1" onClick={(e) => this.operationUi(e)}>
                                    <div className="border_bg"></div>
                                    <img className="img" id="wolud"></img>
                                    <span className="test"></span>
                                    <span className="p_test"></span>
                                    <audio className="my_audio">
                                        <source className="notificationTone" id="./Down.m4a" />
                                    </audio>
                                </div>
                            </div>
                        </div> {/* content_bar */}
                    </div> {/* audio_content */}
                    <div className="audio_content">
                        <div className="content_bar">
                            <div className="touch_ui">
                                <div className="img_content" id="node0" onClick={(e) => this.operationUi(e)}>
                                    <div className="border_bg"></div>
                                    <img className="img" id="out_world"></img>
                                    <span className="test"></span>
                                    <span className="p_test"></span>
                                    <audio className="my_audio">
                                        <source className="notificationTone" id="Serato_Recording" />
                                    </audio>
                                </div>
                            </div>
                        </div>{/* content_bar */}
                    </div> {/* audio_content */}
                </div>{/* media_content */}
                <div className="ui_content">
                    <span className="content_name">Wouldn't Wanna Be Swept Away</span>
                </div>
            </main>
        )
    }
}
