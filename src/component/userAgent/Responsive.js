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
            window.alert("Success")
        } else if (typeof operation === 'undifined') {
            throw ReferenceError("operation is undifined")
        } else {
            audio.parentElement.pause()
        }
    }

    static isSupport() {
        return /iPhone | iPad | iPhone | Android/.test(navigator.userAgent)
    }
}