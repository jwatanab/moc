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
        if (option) {
            Client.srcGen(audio.id)
                .then((result) => {
                    audio.src = result
                    audio.parentElement.load()
                    return audio.parentElement.play()
                })
                .catch((e) => assert.ifError(e))
        } else {
            if (operation) {
                audio.parentElement.play()
            } else if (typeof operation === 'undifined') {
                return
            } else if (!operation) {
                audio.parentElement.pause()
            }
        }
    }
}