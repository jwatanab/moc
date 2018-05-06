import React from 'react'
import assert from 'assert'
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
        const bg = parent.querySelector('.border_bg')
        const master_audio = parent.parentElement.querySelector('.notificationTone')
        const promise = new Promise((resolve, reject) => {
            request.post('/content')
                .responseType('arraybuffer')
                .query({ name: './Down.m4a' })
                .send(null)
                .end((err, res) => {
                    assert.ifError(err)
                    const blob = new Blob([result], { type: 'audio/mpeg3' })
                    const url = URL.createObjectURL(blob)
                    resolve(url)
                })
        })

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
            master_audio.parentElement.pause()

            setTimeout(() => {
                pause_btn.style.transition = '.7s'
                pause_btn.style.opacity = '0'

                setTimeout(() => pause_btn.setAttribute('style', 'opacity: 0;'), 300)
            }, 100)
            bg.style.opacity = '0'

            eval(`this.state.${parentId}.ui_touch_flag = false`)
        } else {
            // init Event Handler
            if (eval(`this.state.${parentId}.operation_flag`)) {
                play_btn.style.opacity = '1'
                master_audio.parentElement.play()
            } else {
                promise
                    .then((result) => {
                        master_audio.setAttribute('src', result)
                        master_audio.parentElement.load()
                        master_audio.parentElement.play()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                eval(`this.state.${parentId}.operation_flag = true`)
            }

            setTimeout(() => {
                play_btn.style.transition = '.7s'
                play_btn.style.opacity = '0'

                setTimeout(() => play_btn.setAttribute('style', 'opacity: 0;'), 300)
            }, 100)
            bg.style.opacity = '1'

            eval(`this.state.${parentId}.ui_touch_flag = true`)
        }
    }

    render() {
        return (
            // DOM依存状態を抜け出すために兄弟や親として指定しないこと
            <main className="main_container">
                <div className="audio_content">
                    {/* audio_content -*/}
                    <div className="content_bar">
                        {/* content_bar */}
                        <div className="touch_ui">
                            <div className="img_content" id="node0" onClick={(e) => this.operation_ui(e)}>
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
                        </div>
                        {/* content_bar */}
                    </div>
                    {/* audio_content */}
                </div>
                <div className="audio_content">
                    {/* audio_content */}
                    <div className="content_bar">
                        {/* content_bar */}
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
                        </div>
                        {/* content_bar */}
                    </div>
                    {/* audio_content */}
                </div>
            </main>
        )
    }
}