import React from 'react'
import { Client } from '../commonUtil/index'
import assert, { throws } from 'assert'

export default class Responsive {
    constructor() { }

    operation_audio(audio, operation, phone_btn, option = null) {
        if (!audio) throw new Error(`DOMException: audio is ${typeof audio}`)
        if (option) {
            Client.src_gen(audio.id)
                .then((result) => {
                    audio.src = result
                    audio.parentElement.load()
                    return phone_btn.click()
                })
                .catch((e) => assert.ifError(e))
        } else {
            if (operation) {
                phone_btn.click()
            }
            else if (typeof ope === 'undifined') return
            else if (!operation) phone_btn.click()
        }
    }

    toSupport() {
        if (navigator.userAgent.indexOf('iphone') > 0 && navigator.userAgent.indexOf('iPad') == -1)
            return true
        else if (navigator.userAgent.indexOf('iPod') > 0)
            return true
        else if (navigator.userAgent.indexOf('Android') > 0)
            return true
        else return false
    }
}