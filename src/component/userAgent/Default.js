import Client from '../commonUtil/Client'
import assert, { throws } from 'assert'

export default class Default {

    static operationAudio(audio, operation, option = null) {
        if (!audio) throw new Error(`DOMException: audio is ${typeof audio}`)
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
            }
            else if (typeof ope === 'undifined') return
            else if (!operation) audio.parentElement.pause()
        }
    }
}