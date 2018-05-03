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
            ui_touch_flag: false,
            operation_flag: false
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
        // declaration
        const play_btn = document.querySelector('#test')
        const pause_btn = document.querySelector('#p_test')
        const bg = document.querySelector('.border_bg')
        const master_audio = document.querySelector(`.notificationTone`)
        const promise = new Promise((resolve, reject) => {
            request.post('/content')
                .responseType('arraybuffer')
                .query({ name: './Down.m4a' })
                .send(null)
                .end((err, res) => {
                    assert.ifError(err)
                    resolve(res.body)
                })
        })

        // Event Handler processing
        if (this.state.ui_touch_flag) {
            pause_btn.style.opacity = '1'
            master_audio.parentElement.pause()

            setTimeout(() => {
                pause_btn.style.transition = '.7s'
                pause_btn.style.opacity = '0'

                setTimeout(() => pause_btn.setAttribute('style', 'opacity: 0;'), 300)
            }, 100)
            bg.style.opacity = '0'

            this.state.ui_touch_flag = false
        } else {
            // init Event Handler
            if (this.state.operation_flag) {
                play_btn.style.opacity = '1'
                master_audio.parentElement.play()
            } else
                promise
                    .then((result) => {
                        const blob = new Blob([result], { type: 'audio/mpeg3' })
                        const url = URL.createObjectURL(blob)
                        master_audio.setAttribute('src', url)
                        master_audio.parentElement.load()
                        master_audio.parentElement.play()
                        this.state.operation_flag = true
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            setTimeout(() => {
                play_btn.style.transition = '.7s'
                play_btn.style.opacity = '0'

                setTimeout(() => play_btn.setAttribute('style', 'opacity: 0;'), 300)
            }, 100)
            bg.style.opacity = '1'

            this.state.ui_touch_flag = true
        }

        if (!this.state.children) {
            this.setState({
                children: (
                    <div>
                        <p>descrption to init modules 193.168.100.1:3000</p>
                        <Rcslider />
                    </div>)
            })
        } else {
            this.setState({
                children: null
            })
        }
    }

    render() {
        return (
            // DOM依存状態を抜け出すために兄弟や親として指定しないこと
            <main className="main_container">
                <div className="audio_content">
                    {/* audio_content */}
                    <div className="content_bar">
                        {/* content_bar */}
                        <div className="touch_ui">
                            <div className="img_content" onClick={(e) => this.operation_ui(e)}>
                                <div className="border_bg"></div>
                                <img className="img" id="./node.jpg"></img>
                                <span id="test"></span>
                                <span id="p_test"></span>
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