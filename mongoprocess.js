var fs = require('fs'),
    path = require('path'),
    mongodb = require('mongodb'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017',
    dbName = 'archiveMoc',
    document = 'fs.files'

function insert() {
    if (!filename || !dirfilename) return console.log('変数にファイル名、ディレクトリ名を指定してね！')
    MongoClient.connect(url, function (e, cli) {
        assert.ifError(e)
        const db = cli.db(dbName)
        var bucket = new mongodb.GridFSBucket(db)
        fs.createReadStream(dirfilename)
            .pipe(bucket.openUploadStream(filename))
            .on('error', function (e) {
                assert.ifError(e)
            })
            .on('finish', function () {
                console.log('success')
                process.exit(0)
            })
    })
}

function findAllDocuments(collection, callback) {
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log(docs)
        callback(docs)
    })
}

function find() {
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err)
        const db = client.db(dbName)
        const collection = db.collection('fs.files')
        findAllDocuments(collection, function () {
            client.close()
        })
    })
}

function findDocument(collection, callback) {
    collection.findOne({ 'filename': process.argv[2] })
        .then((e) => {
            getChunks(e.filename)
            callback(e)
        })
        .catch((e) => {
            console.log(e)
            process.exit(-1)
        })
}

function geRe() {
    MongoClient.connect(url, (e, c) => {
        assert.ifError(e)
        const db = c.db(dbName)
        const collection = db.collection(document)
        findDocument(collection, () => {
            c.close()
        })
    })
}

function getChunks(name) {
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err)
        const db = client.db(dbName)
        const ins = new mongodb.GridFSBucket(db)
        const downloadStream = ins.openDownloadStreamByName(name)
        downloadStream.on('data', function (e) {
            console.log(e)
            process.exit(0)
        });
        downloadStream.on('error', function (e) {
            console.log(e)
            process.exit(-1)
        });
        downloadStream.on('end', function () {
            console.log('end')
            process.exit(0)
        });
    })
}

function findChunks() {
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err)
        const db = client.db(dbName)
        const ins = new mongodb.GridFSBucket(db)
        const downloadStream = ins.openDownloadStreamByName('0.mp3')
        downloadStream.on('data', function () {
            console.log('start')
        });
        downloadStream.on('error', function (e) {
            console.log(e)
            process.exit(-1)
        });
        downloadStream.on('end', function () {
            console.log('end')
            process.exit(0)
        });
    })
}

function ec(e) {
    assert.ifError(e)
}

if (require.main == module) {
    let pointer = {
        'view': {
            message: 'Use Function',
            script: () => {
                MongoClient.connect(url, function (err, client) {
                    assert.equal(null, err)
                    const db = client.db(dbName)
                    const collection = db.collection('fs.files')
                    findAllDocuments(collection, function () {
                        client.close()
                        process.exit(0)
                    })
                })
            }
        },
        'insert': {
            message: 'Use Function',
            script: () => {
                if (process.argv.length < 4) {
                    console.log(`Usage: nodeprocess.js
                        Function: Insert
                        Argment: node mongoprocess.js Insert (fileName[upload])`)
                    process.exit(-1)
                }
                const filename = process.argv[3]

                // ポート接続、コールバックにはエラーか、DBコネクトが返される
                MongoClient.connect(url, function (e, cli) {
                    // エラーが存在する場合、処理
                    assert.ifError(e)
                    // コネクトにDBをリクエストする
                    const db = cli.db(dbName)
                    // Mongo.GridFSインスタンス
                    var bucket = new mongodb.GridFSBucket(db)
                    // ファイル読み込み
                    fs.createReadStream(filename)
                        // 成功処理、db.fs.filesに処理されたblobが格納される
                        .pipe(bucket.openUploadStream(filename))
                        // エラー時
                        .on('error', function (e) {
                            assert.ifError(e)
                        })
                        // 終了時
                        .on('finish', function () {
                            console.log('success')
                            // プロセスを正常に抜ける
                            process.exit(0)
                        })
                })
            }
        },
        'test': {
            'message': 'Use Function',
            script: () => {
                console.log('テストだよ')
            }
        }
    }

    if (process.argv.length < 3) {
        console.log('usage: %s insert or view', process.argv[1])
        process.exit(-1)
    }

    for (let i in pointer)
        if (i === process.argv[2])
            pointer[i].script()

    // console.log(`Undefined ${process.argv[2]}`)
}