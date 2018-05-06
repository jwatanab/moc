import React from 'react'
import assert from 'assert'
import request from 'superagent'
import { VelocityTransitionGroup } from 'velocity-react'

export default class Ui_Bar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

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
                </VelocityTransitionGroup >
            </div>
        )
    }
}