import Client from '../commonUtil/Client'
import assert, { throws } from 'assert'

export default class Responsive {

    /**
     * 
     * @param {*} audio 
     * @param {*} operation 
     * @param {*} phone_btn 
     * @param {*} option 
     */
    static operationAudio(audio, operation, phoneBtn, option = null) {
        if (!audio) throw new Error(`DOMException: audio is ${typeof audio}`)
        if (option) {
            Client.srcGen(audio.id)
                .then((result) => {
                    audio.src = result
                    audio.parentElement.load()
                    return phoneBtn.click()
                })
                .catch((e) => assert.ifError(e))
        } else {
            if (operation) {
                phoneBtn.click()
            }
            else if (typeof ope === 'undifined') return
            else if (!operation) phoneBtn.click()
        }
    }

    /** 
     * 
    */
    static isSupport() {
        if (navigator.userAgent.indexOf('iphone') > 0 && navigator.userAgent.indexOf('iPad') == -1)
            return true
        else if (navigator.userAgent.indexOf('iPod') > 0)
            return true
        else if (navigator.userAgent.indexOf('Android') > 0)
            return true
        else return false
    }
}