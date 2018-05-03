window.onload = () => {

    Array.from(document.querySelectorAll('.content_bar .fa'))
        .map(i => {
            i.onclick = (e) => {
                e = e.target
                const name = `#${e.id} + audio source`
                const boolean = document.querySelector(name).getAttribute('src')
                if (boolean) {
                    if (e.className === 'fas fa-play') {
                        e.className = 'fas fa-pause'
                        e.nextElementSibling.play()
                        return
                    }
                    if (e.className === 'fas fa-play') {
                        e.className = 'fas fa-pause'
                        e.nextElementSibling.pause()
                        return
                    }
                    if (e.className === 'fa fa-spinner fa-spin fa-lg fa-fw margin-bottom') {
                        e.className = 'fa fa-pause-circle'
                        e.nextElementSibling.play()
                        return
                    }
                } else {
                    e.className = 'fa fa-spinner fa-spin fa-lg fa-fw margin-bottom'
                    const oReq = new XMLHttpRequest()
                    oReq.open("POST", "/content", true)
                    oReq.responseType = "arraybuffer"
                    oReq.onload = function (oEvent) {
                        if (oReq.response) setBuffer(oReq.response, e)
                    }
                    oReq.onerror = function (e) {
                        console.log(e)
                        return
                    }
                    oReq.send(null)
                }
            }
        })

    function setBuffer(e, n) {
        const nid = n.id
        const blob = new Blob([e], { type: 'audio/mpeg3' })
        const url = URL.createObjectURL(blob)
        const t = document.querySelector(`#${nid} + audio source`)
        t.setAttribute('src', url)
        t.parentElement.load()
        n.click()
        url.revokeObjectURL()
    }
}