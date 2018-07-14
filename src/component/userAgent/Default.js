export default class Default {

    /**
     * @param {HTMLAudioElement} audio 
     * @param {boolean} operation 
     */
    static operationAudio(audio, operation) {
        if (arguments.length < 2) {
            throw new RangeError("Not enough arguments")
        }
        if (operation) {
            audio.parentElement.play()
        } else if (typeof operation === 'undifined') {
            return
        } else {
            console.log('default start')
            audio.parentElement.pause()
        }
    }
}