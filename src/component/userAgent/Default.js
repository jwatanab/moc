import Client from '../commonUtil/Client'
import assert, { throws } from 'assert'

export default class Default {

    /**
     * 
     * @param {source} audio 
     * @param {*} operation 
     * @param {*} option 
     */
    static operationAudio(audio, operation, option = null) {
        if (arguments.length < 2) {
            throw new RangeError("Not enough arguments")
        }
        if (operation) {
            audio.parentElement.play()
        } else if (typeof operation === 'undifined') {
            return
        } else {
            audio.parentElement.pause()
        }
    }
}