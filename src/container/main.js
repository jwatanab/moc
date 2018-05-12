import React from 'react'
import assert, { throws } from 'assert'
import request from 'superagent'
import ReactSlider from 'react-slider'
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
    }

    operation_ui(e) {
        // Each declaration
        const parentId = e.target.className === 'img_content' ? e.target.id : e.target.parentElement.id
        const parent = document.querySelector(`#${parentId}`)
        const play_btn = parent.querySelector('.test')
        const pause_btn = parent.querySelector('.p_test')
        const border = parent.querySelector('.border_bg')
        const audio = parent.parentElement.querySelector('.notificationTone')

        // Individual processing
        if (eval(`typeof this.state.${parentId}`) === 'undefined') {
            eval(`this.state.${parentId} = {
                ui_touch_flag: false,
                operation_flag: false
            }`)
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

    src_gen(request_name) {
        return new Promise((resolve, reject) => {
            request.post('/content')
                .responseType('arraybuffer')
                .query({ filename: `${request_name}.m4a` })
                .end((err, res) => {
                    assert.ifError(err)
                    resolve(new Blob([res], { type: 'audio/mpeg3' }))
                })
        })
    }

    operation_audio(audio, operation, option = null) {
        if (!audio) throw new Error(`DOMException: audio is ${typeof audio}`)
        if (option) {
            this.src_gen(audio.id)
                .then((result) => {
                    audio.parentElement.load()
                    audio.srcObject = result
                    audio.parentElement.load()
                    return audio.parentElement.play()
                })
                .catch((e) => {
                    throw new Error(e)
                })
        } else {
            if (operation) audio.parentElement.play()
            else if (typeof ope === 'undifined') return
            else if (!operation) audio.parentElement.pause()
        }
    }

    render() {
        return (
            <main className="main_container">
                <div className="audio_content">
                    <div className="content_bar">
                        <div className="touch_ui">
                            <div className="img_content" id="node0" onClick={(e) => this.operation_ui(e)}>
                                <div className="border_bg"></div>
                                <img className="img" id="./node.jpg"></img>
                                <span className="test"></span>
                                <span className="p_test"></span>
                            </div>
                            <div className="ui_content">
                                <audio className="my_audio">
                                    <source className="notificationTone" id="Serato_Recording" />
                                </audio>
                                <span className="content_name">list - est</span>
                            </div>
                            <div className="description_content">
                                <VelocityTransitionGroup runOnMount={false}
                                    enter={{ animation: 'slideDown', stagger: 100 }}
                                    leave={{ animation: 'slideUp', stagger: 100 }}>
                                    {this.state.modal}
                                </VelocityTransitionGroup>
                            </div>
                        </div> {/* content_bar */}
                    </div> {/* audio_content */}
                </div>
                <div className="audio_content">
                    <div className="content_bar">
                        <div className="touch_ui">
                            <div className="img_content" id="node1" onClick={(e) => this.operation_ui(e)}>
                                <div className="border_bg"></div>
                                <img className="img" id="./node.jpg"></img>
                                <span className="test"></span>
                                <span className="p_test"></span>
                            </div>
                            <div className="ui_content">
                                <audio className="my_audio">
                                    <source className="notificationTone" />
                                </audio>
                                <span className="content_name">list - est</span>
                            </div>
                            <div className="description_content">
                                <VelocityTransitionGroup runOnMount={false}
                                    enter={{ animation: 'slideDown', stagger: 100 }}
                                    leave={{ animation: 'slideUp', stagger: 100 }}>
                                    {this.state.modal}
                                </VelocityTransitionGroup>
                            </div>
                        </div> {/* content_bar */}
                    </div> {/* audio_content */}
                </div>
            </main>
        )
    }
}
