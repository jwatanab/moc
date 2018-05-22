import React from 'react'
import assert, { throws } from 'assert'
import request from 'superagent'
import Rcslider from 'rc-slider'
import { Responsive, Default } from '../component/userAgent/index'
import { Client } from '../component/commonUtil/index'
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
        Client.common_request('/initilize')
            .then((e) => {
                // Init AudioElement TouchEventHandler
                [document.querySelectorAll('.audio_content')].map((i, c) => i.dataset.name = e[c])
            })
    }

    componentDidMount() {
        // Init Image Front
        [document.querySelectorAll('.img')]
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
        [document.querySelectorAll('.audio_content')]
            .map((audioContent, elementIndex) => {

                const imgContent = audioContent.querySelector('.img_content')
                const NODELIST_LENGTH = (document.querySelectorAll('.audio_content').length - 1)
                const constantSet = {
                    NODELIST_LENGTH: NODELIST_LENGTH,
                    MOVE_LKEY: 50,
                    MOVE_RKEY: -50,
                    direction: null,
                    position: null
                }

                /*
                const last_parant_element = document.querySelectorAll('.audio_content')[this_length]
                const last_element = last_parant_element.querySelector('.img_content')
                */

                imgContent.dataset.index = elementIndex

                if (elementIndex !== 0) {
                    i.className = `${parentElement.getAttribute('class')} none`
                }

                imgContent.addEventListener('touchstart', (e) => {
                    constantSet.position = e.touches[0].pageX
                    constantSet.direction = ''
                }, { passive: false })

                img_content.addEventListener('touchmove', (e) => {
                    if (constantSet.position - e.touches[0].pageX > constantSet.MOVE_LKEY) {
                        return direction = 'left'
                    }
                    if (constantSet.position - e.touches[0].pageX < constantSet.MOVE_RKEY) {
                        return direction = 'right'
                    }
                }, { passive: false })

                img_content.addEventListener('touchend', (e) => {
                    const currentId = e.target.className === 'img_content' ? e.target.id : e.target.parentElement.id
                    const current = document.querySelector(`#${currentId}`)
                    const viewText = document.querySelector('.content_name')
                    const currentIndex = parseInt(current.dataset.index)
                    if (constantSet.direction == 'right') {
                        if (currentIndex === this_length) return alert('最大件数')

                        this.slide_animation(current, viewText, 'right')

                    } else if (constantSet.direction == 'left') {
                        if (currentId === 0) return alert("零")

                        this.slide_animation(current, viewText, 'left')


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
                        this.operation_ui({ target: audio_list[i] }, true)
            })

            audio_list[j].addEventListener('ended', (e) => {
                this.operation_ui({ target: audio_list[j] }, true)
            })
        }
    }

    /**
     * @param {HTMLElement} current 
     * @param {HTMLElement} viewText 
     * @param {String} direction 
     */
    slide_animation(current, viewText, direction) {

        const currentId = parseInt(current.dataset.index)
        const currentParent = current.closest('.audio_content')
        const constantSet = {
            SLIDE_RKEY: null,
            SLIDE_LKEY: null,
            INCREMENT: null
        }

        if (direction === 'right') {
            constantSet.SLIDE_RKEY = '400px'
            constantSet.constantSetSLIDE_LKEY = '-400px'
            constantSet.INCREMENT = 1
        } else if (direction === 'left') {
            constantSet.SLIDE_RKEY = '-400px'
            constantSet.SLIDE_LKEY = '400px'
            constantSet.INCREMENT = -1
        } else {
            return false
        }

        const next = document.querySelector(`[data-index="${currentId + constantSet.INCREMENT}"]`)
        const nextParent = next.closest('.audio_content')
        const name = nextParent.dataset.name

        current.style.opacity = '0'
        current.style.left = constantSet.SLIDE_RKEY
        setTimeout(() => {
            currentParent.style.display = 'none'
            current.display = 'none'
            next.style.opacity = '0'
            nextParent.className = 'audio_content block'
            nextParent.style.display = 'block'
            viewText.innerHTML = name
            setTimeout(() => {
                next.style.display = 'block'
                next.style.left = constantSet.SLIDE_LKEY
                setTimeout(() => {
                    next.style.opacity = '1'
                    next.style.left = '0px'
                }, 100)
            })
        }, 500)
    }

    operation_ui(e, recession = null) {
        // Each declaration
        const parentId = e.target.className === 'img_content' ? e.target.id : e.target.parentElement.id
        const parent = document.querySelector(`#${parentId}`)
        const play_btn = parent.querySelector('.test')
        const pause_btn = parent.querySelector('.p_test')
        const border = parent.querySelector('.border_bg')
        const audio = parent.querySelector('.notificationTone')

        // Individual processing
        if (eval(`typeof this.state.${parentId}`) === 'undefined') {
            eval(`this.state.${parentId} = {
                ui_touch_flag: false,
                operation_flag: false
            }`)
        }

        if (Responsive.toSupport()) {
            // It saves the music element
            if (recession) {
                if (typeof audio.src !== 'undifined') {
                    setTimeout(() => Responsive.operation_audio(audio, false, phone_btn), 300)
                }
                border.style.opacity = '0'
                return eval(`this.state.${parentId}.ui_touch_flag = false`)
            }

            // Event Handler processing
            if (eval(`this.state.${parentId}.ui_touch_flag`)) {
                pause_btn.style.opacity = '1'
                Responsive.operation_audio(audio, false, phone_btn)

                setTimeout(() => {
                    pause_btn.style.transition = '.7s'
                    pause_btn.style.opacity = '0'

                    setTimeout(() => pause_btn.setAttribute('style', 'opacity: 0;'), 300)
                }, 100)
                border.style.opacity = '0'

                eval(`this.state.${parentId}.ui_touch_flag = false`)
            } else {
                // init Event Handler
                if (eval(`this.state.${parentId}.operation_flag`)) {
                    play_btn.style.opacity = '1'
                    Responsive.operation_audio(audio, true, phone_btn)
                } else {
                    Responsive.operation_audio(audio, true, phone_btn, true)
                    eval(`this.state.${parentId}.operation_flag = true`)
                }

                setTimeout(() => {
                    play_btn.style.transition = '.7s'
                    play_btn.style.opacity = '0'

                    setTimeout(() => play_btn.setAttribute('style', 'opacity: 0;'), 300)
                }, 100)
                border.style.opacity = '1'

                eval(`this.state.${parentId}.ui_touch_flag = true`)
            }
        } else {
            // It saves the music element
            if (recession) {
                if (typeof audio.src !== 'undifined') {
                    setTimeout(() => Default.operation_audio(audio, false), 300)
                }
                border.style.opacity = '0'
                return eval(`this.state.${parentId}.ui_touch_flag = false`)
            }

            // Event Handler processing
            if (eval(`this.state.${parentId}.ui_touch_flag`)) {
                pause_btn.style.opacity = '1'
                Default.operation_audio(audio, false)

                setTimeout(() => {
                    pause_btn.style.transition = '.7s'
                    pause_btn.style.opacity = '0'

                    setTimeout(() => pause_btn.setAttribute('style', 'opacity: 0;'), 300)
                }, 100)
                border.style.opacity = '0'

                eval(`this.state.${parentId}.ui_touch_flag = false`)
            } else {
                // init Event Handler
                if (eval(`this.state.${parentId}.operation_flag`)) {
                    play_btn.style.opacity = '1'
                    Default.operation_audio(audio, true)
                } else {
                    Default.operation_audio(audio, true, true)
                    eval(`this.state.${parentId}.operation_flag = true`)
                }

                setTimeout(() => {
                    play_btn.style.transition = '.7s'
                    play_btn.style.opacity = '0'

                    setTimeout(() => play_btn.setAttribute('style', 'opacity: 0;'), 300)
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
                                <div className="img_content" id="node1" onClick={(e) => this.operation_ui(e)}>
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
                                <div className="img_content" id="node0" onClick={(e) => this.operation_ui(e)}>
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
