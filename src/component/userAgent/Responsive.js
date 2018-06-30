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
            return
        } else {
            audio.parentElement.pause()
        }
    }

    static isSupport() {
        if (navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') !== -1)
            return true
        else if (navigator.userAgent.indexOf('iPod') > 0)
            return true
        else if (navigator.userAgent.indexOf('Android') > 0)
            return true
        else return false
    }
}