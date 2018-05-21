import request from 'superagent'
import assert, { throws } from 'assert'

export default class Client {
    constructor() { }

    src_gen(request_name) {
        if (request_name === "Serato_Recording") request_name = `${request_name}.m4a`
        return new Promise((resolve, reject) => {
            request.post('/content')
                .responseType('arraybuffer')
                .query({ filename: request_name })
                .send(null)
                .end((err, res) => {
                    assert.ifError(err)
                    const blob = new Blob([res.body], { type: 'audio/mpeg3' })
                    const url = URL.createObjectURL(blob)
                    resolve(url)
                })
        })
    }

    common_request(url, request_name = null) {
        return new Promise((resolve, reject) => {
            request.post(url)
                .end((err, res) => {
                    assert.ifError(err)
                    resolve(res.body)
                })
        })
    }
}