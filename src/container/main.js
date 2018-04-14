import React from 'react'
import assert from 'assert'
import request from 'superagent'
import ReactSlider from 'react-slider'
import CSSTransitionGroup from 'react-addons-transition-group'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isShown: false }
    }

    componentDidMount() {
        // Init Image Front
        Array.from(document.querySelectorAll('.image'))
            .map(i => {
                console.log('start')
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

        // Init Click Eventhandler
        Array.from(document.querySelectorAll('.content_bar .fa'))
            .map(i => {
                i.onclick = (e) => {
                    const icon = e.target
                    const name = `#${icon.id} + audio source`
                    const boolean = document.querySelector(name).getAttribute('src')
                    if (boolean) {
                        if (icon.classNamicon === 'fa fa-play-circle') {
                            icon.className = 'fa fa-pause-circle'
                            icon.nextElementSibling.play()
                            return
                        }
                        if (icon.className === 'fa fa-pause-circle') {
                            icon.className = 'fa fa-play-circle'
                            icon.nextElementSibling.pause()
                            return
                        }
                        if (icon.className === 'fa fa-spinner fa-spin fa-lg fa-fw margin-bottom') {
                            icon.className = 'fa fa-pause-circle'
                            icon.nextElementSibling.play()
                            return
                        }
                    } else {
                        icon.className = 'fa fa-spinner fa-spin fa-lg fa-fw margin-bottom'

                        request.post('/content')
                            .responseType('arraybuffer')
                            .query({ name: './Down.m4a' })
                            .send(null)
                            .end((err, res) => {
                                assert.ifError(err)
                                this.setBuffer(res.body, icon)
                            })
                    }
                }
            })
    }

    //
    setBuffer(e, n) {
        const nid = n.id
        const blob = new Blob([e], { type: 'audio/mpeg3' })
        const url = URL.createObjectURL(blob)
        const t = document.querySelector(`#${nid} + audio source`)
        t.setAttribute('src', url)
        t.parentElement.load()
        n.click()
    }

    render() {
        let component = this.state.isShown ? this.SlideBox() : ''
        return (
            // DOM依存状態を抜け出すために兄弟や親として指定しないこと
            <main className="main_container">
                <div className="audio_content">
                    <div className="content_bar">
                        <div className="img_content">
                            <img className="image" id="./node.jpg"></img>
                        </div>
                        {
                            // テストグループ
                        }


                        <ReactCSSTransitionGroup
                            transitionName="slide"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}
                        >

                        </ReactCSSTransitionGroup>
                        {
                            // テストグループ
                        }
                        <div className="description_content">
                            <i className="fa fa-play-circle" aria-hidden="true" id="three"></i>
                            <audio className="my_audio">
                                <source className="notificationTone" />
                            </audio>
                            <span className="content_name">Test - list</span>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}