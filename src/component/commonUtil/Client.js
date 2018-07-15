import request from 'superagent'
import assert, { throws } from 'assert'

export default class Client {

    static toUrl(require) {
        return new Promise((resolve, reject) => {
            request.post(require.url)
                .responseType('arraybuffer')
                .query({ filename: require.request_name })
                .send(null)
                .end((err, res) => {
                    assert.ifError(err)
                    const blob = new Blob([res.body], { type: require.type })
                    const url = URL.createObjectURL(blob)
                    resolve({ url: url, audioName: require.request_name })
                })
        })
    }

    static commonRequest(url, request_name = null) {
        return new Promise((resolve, reject) => {
            request.post(url)
                .end((err, res) => {
                    assert.ifError(err)
                    resolve(res.body)
                })
        })
    }
}