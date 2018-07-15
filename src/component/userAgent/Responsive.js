export default class Responsive {

    static IOSSetup() {
        const context = new (window.AudioContext || window.webkitAudioContext)()
        const src = context.createBufferSource()
        src.buffer = context.createBuffer(1, 1, 22050)
        src.connect(context.destination)
        src.start(0)
    }

    /**
     * @param {HTMLAudioElement} audio
     * @param {boolean} operation 
     */
    static operationAudio(audio, operation) {
        if (arguments.length < 2)
            throw new RangeError("Not enough arguments")

        if (operation) {
            audio.parentElement.play()
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