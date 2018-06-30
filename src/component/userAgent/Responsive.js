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
        if (arguments.length < 2) {
            throw new RangeError("Not enough arguments")
        }
        console.log("Responsive")
        if (operation) {
            audio.parentElement.play()
        } else if (typeof operation === 'undifined') {
            return
        } else {
            audio.parentElement.pause()
        }
    }

    /** 
     * 
    */
    static isSupport() {
        console.log(navigator.userAgent)
        if (navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') !== -1)
            return true
        else if (navigator.userAgent.indexOf('iPod') > 0)
            return true
        else if (navigator.userAgent.indexOf('Android') > 0)
            return true
        else return false
    }
}