import React from 'react'
import assert, { throws } from 'assert'
import request from 'superagent'
import Rcslider from 'rc-slider'
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
            .map(i => {
                let direction, position

                const getPosition = (e) => { return e.touches[0].pageX }

                i.addEventListener('touchstart', (e) => {
                    position = getPosition(e)
                    direction = ''
                })
                i.addEventListener('touchmove', (e) => {
                    if (position - getPosition(e) > level) direction = 'left'
                    else if (position - getPosition(e) < -level) direction = 'right'
                })
                i.addEventListener('touchend', (e) => {
                    if (direction == 'right') return

                    else if (direction == 'left') return
                })
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

        // It saves the music element
        if (recession) {
            if (typeof audio.src !== 'undifined') {
                setTimeout(() => this.operation_audio(audio, false), 300)
            }
            border.style.opacity = '0'
            return eval(`this.state.${parentId}.ui_touch_flag = false`)
        }

        // Event Handler processing
        if (eval(`this.state.${parentId}.ui_touch_flag`)) {
            pause_btn.style.opacity = '1'
            this.operation_audio(audio, false)

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
                this.operation_audio(audio, true)
            } else {
                this.operation_audio(audio, true, true)
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

    operation_audio(audio, operation, option = null) {
        if (!audio) throw new Error(`DOMException: audio is ${typeof audio}`)
        if (option) {
            this.src_gen(audio.id)
                .then((result) => {
                    audio.src = result
                    audio.parentElement.load()
                    return audio.parentElement.play()
                })
                .catch((e) => {
                    throw new Error(e)
                })
        } else {
            if (operation) {
                audio.parentElement.play()
            }
            else if (typeof ope === 'undifined') return
            else if (!operation) audio.parentElement.pause()
        }
    }

    src_gen(request_name) {
        if (request_name === "Serato_Recording") request_name = `${request_name}.m4a`
        return new Promise((resolve, reject) => {
            request.post('/content')
                .responseType('arraybuffer')
                .query({ filename: request_name })
                .send(null)
                .end((err, res) => {
                    assert.ifError(err)
                    const blob = new Blob([res.body], { type: 'audio/mpeg3' })
                    const url = URL.createObjectURL(blob)
                    resolve(url)
                })
        })
    }

    render() {
        return (
            <main className="main_container">
                {/*<div className="audio_content">
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
                            <div className="ui_content">
                                <span className="content_name">list - est</span>
                            </div>
                            <div className="description_content">
                                <VelocityTransitionGroup runOnMount={false}
                                    enter={{ animation: 'slideDown', stagger: 100 }}
                                    leave={{ animation: 'slideUp', stagger: 100 }}>
                                    {this.state.modal}
                                </VelocityTransitionGroup>
                            </div>
                        </div>
                    </div> */}{/* content_bar */}
                {/*</div>*/} {/* audio_content */}
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
                            <div className="ui_content">
                                <span className="content_name">Wouldn't Wanna Be Swept Away</span>
                            </div>
                            <div className="description_content">
                                <VelocityTransitionGroup runOnMount={false}
                                    enter={{ animation: 'slideDown', stagger: 100 }}
                                    leave={{ animation: 'slideUp', stagger: 100 }}>
                                    {this.state.modal}
                                </VelocityTransitionGroup>
                            </div>
                        </div>
                    </div> {/* content_bar */}
                </div> {/* audio_content */}
            </main>
        )
    }
}
