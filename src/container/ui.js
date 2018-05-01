import React from 'react'
import assert from 'assert'
import request from 'superagent'
import { VelocityTransitionGroup } from 'velocity-react'

export default class Ui_Bar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            argc: <div className="main_content_ber" onClick={(e) => this.setWindow(e)}></div>,
            argv: <div></div>,
            flag: true
        }
    }

    componentDidMount() {
        // Init Click Eventhandler
        const master = document.querySelector('.master')
        Array.from(document.querySelectorAll('.main_content_ber'))
            .map(i => {
                i.onclick = (e) => {
                    console.log(master.src)
                    /*if (!master.src)
                        request.post('/content')
                            .responseType('arraybuffer')
                            .query({ name: './Down.m4a' })
                            .send(null)
                            .end((err, res) => {
                                assert.ifError(err)
                                this.setBuffer(res.body, master)
                            })*/
                }
            })
    }

    setWindow(e) {
        const u = document.querySelector('.modal')
        const src = document.querySelector('.image').src
        if (this.state.flag) {
            console.log('flower')
            this.setState({
                argv: (
                    <div className="modal">
                        <div className="close" onClick={(e) => this.setWindow(e)}>&times;</div>
                        <div className="text_content">
                            <div className="inner_text">
                                <div className="touch_ui">
                                    <div className="img_content" onClick={(e) => this.append(e)}>
                                        <img className="clone" src={src}></img>
                                    </div>
                                    <div className="ui_content">
                                        <audio className="my_audio">
                                            <source className="notificationTone" />
                                        </audio>
                                        <span className="content_name">実験 - テスト</span>
                                    </div>
                                    <div className="description_content">
                                        <VelocityTransitionGroup
                                            runOnMount={false}
                                            enter={{
                                                animation: 'slideDown',
                                                stagger: 100,
                                            }}
                                            leave={{
                                                animation: 'slideUp',
                                                stagger: 100,
                                            }}>
                                            {this.state.children}
                                        </VelocityTransitionGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            this.state.flag = false
        } else {
            console.log('start revfrffffr')
            this.state.flag = true
            this.setState({ argv: <div></div> })
        }
    }

    //
    setBuffer(e, n) {
        const blob = new Blob([e], { type: 'audio/mpeg3' })
        const url = URL.createObjectURL(blob)
        n.setAttribute('src', url)
        n.play()
    }

    render() {
        return (
            <div>
                <audio className="master"></audio>
                <VelocityTransitionGroup
                    runOnMount={false}
                    enter={{
                        animation: 'fadeIn',
                        stagger: 1000,
                    }}
                    leave={{
                        animation: 'fadeOut',
                        stagger: 1000,
                    }}>
                    {this.state.argc}
                    {this.state.argv}
                </VelocityTransitionGroup >
            </div>
        )
    }

}