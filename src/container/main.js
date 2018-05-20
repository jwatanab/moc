import React from 'react'
import assert, { throws } from 'assert'
import request from 'superagent'
import Rcslider from 'rc-slider'
import { Responsive, Default } from '../component/userAgent/index'
import CSSTransitionGroup from 'react-addons-transition-group'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { VelocityTransitionGroup } from 'velocity-react'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        const audio_list = document.querySelectorAll('audio')
        const level = 50

        // Init Image Front
        Array.from(document.querySelectorAll('.img'))
            .map(i => {
                request.post('/main_init')
                    .responseType('arraybuffer')
                    .query({ name: i.id })
                    .send(null)
                    .end((err, res) => {
                        assert.ifError(err)
                        const blob = new Blob([res.body], { type: 'image/png' })
                        const url = URL.createObjectURL(blob)
                        i.src = url
                    })
            })

        // Init AudioElement TouchEventHandler
        Array.from(document.querySelectorAll('.audio_content'))
            .map((i, c) => {

                const img_content = i.querySelector('.img_content')
                const this_length = (document.querySelectorAll('.audio_content').length - 1)

                /*
                const last_parant_element = document.querySelectorAll('.audio_content')[this_length]
                const last_element = last_parant_element.querySelector('.img_content')
                */

                let direction, position, defaultClassName

                img_content.dataset.index = c

                if (c !== 0) {
                    defaultClassName = i.getAttribute('class')
                    i.className = `${defaultClassName} none`
                }

                img_content.addEventListener('touchstart', (e) => {
                    position = e.touches[0].pageX
                    direction = ''
                }, { passive: false })

                img_content.addEventListener('touchmove', (e) => {
                    if (position - e.touches[0].pageX > level) return direction = 'left'
                    if (position - e.touches[0].pageX < -level) return direction = 'right'
                }, { passive: false })

                img_content.addEventListener('touchend', (e) => {
                    const parentId = e.target.className === 'img_content' ? e.target.id : e.target.parentElement.id
                    const parent = document.querySelector(`#${parentId}`)
                    const innerText = document.querySelector('.content_name')
                    const currentId = parseInt(parent.dataset.index)
                    if (direction == 'right') {
                        if (currentId === this_length) return alert('最大件数')

                        const next = document.querySelector(`[data-index="${currentId + 1}"]`)
                        const next_parent = next.closest('.audio_content')

                        parent.style.opacity = '0'
                        parent.style.left = '400px'
                        setTimeout(() => {
                            i.style.display = 'none'
                            parent.display = 'none'

                            next.style.opacity = '0'
                            next_parent.className = 'audio_content block'
                            next_parent.style.display = 'block'
                            innerText.innerHTML = 'test'
                            setTimeout(() => {
                                next.style.display = 'block'
                                next.style.left = '-400px'
                                setTimeout(() => {
                                    next.style.opacity = '1'
                                    next.style.left = '0px'
                                }, 100)
                            })
                        }, 500)
                    } else if (direction == 'left') {
                        if (currentId === 0) return alert("零")

                        const next = document.querySelector(`[data-index="${currentId - 1}"]`)
                        const next_parent = next.closest('.audio_content')

                        parent.style.opacity = '0'
                        parent.style.left = '-400px'
                        setTimeout(() => {
                            i.style.display = 'none'
                            parent.display = 'none'

                            next.style.opacity = '0'
                            next_parent.className = 'audio_content block'
                            next_parent.style.display = 'block'
                            innerText.innerHTML = 'test'
                            setTimeout(() => {
                                next.style.display = 'block'
                                next.style.left = '400px'
                                setTimeout(() => {
                                    console.log(next_parent)
                                    next.style.opacity = '1'
                                    next.style.left = '0px'
                                }, 100)
                            })
                        }, 500)
                    } else {
                        console.log(e.target)
                    }
                }, { passive: false })
            })

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

    operation_select() {
        if (nextId === 0) {
            parent.style.opacity = '0'
            parent.style.left = '400px'
            setTimeout(() => {
                last_element.style.opacity = '0'
                i.style.display = 'none'
                parent.style.display = 'none'
                innerText.innerHTML = 'test'
                setTimeout(() => {
                    last_parant_element.className = `audio_content block`
                    last_element.style.display = 'block'
                    last_element.style.left = '-400px'
                    setTimeout(() => {
                        last_element.style.opacity = '1'
                        last_element.style.left = '0'
                    }, 100)
                })
            }, 500)
        }
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
