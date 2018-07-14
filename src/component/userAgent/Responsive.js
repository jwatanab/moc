export default class Responsive {

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
            throw ReferenceError("operation is undifined")
        } else {
            // console.log('スタート2')
            // console.log(audio.parentElement.paused)
            audio.parentElement.pause()
        }
    }

    static isSupport() {
        if (/iPhone/.test(navigator.userAgent) || /iPad/.test(navigator.userAgent))
            return true
        else if (navigator.userAgent.indexOf('iPod') > 0)
            return true
        else if (navigator.userAgent.indexOf('Android') > 0)
            return true
        else return false
    }
}