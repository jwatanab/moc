const
    fs = require('fs'),
    path = require('path'),
    mongodb = require('mongodb'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017',
    dbName = 'archiveMoc',
    documentName = 'fs.files'

if (require.main !== module) return

let operator = {
    'view': {
        script: () => {
            if (process.argv.length < 3) {
                console.log("Usage: .document view")
                process.exit(-1)
            }
            MongoClient.connect(url, (e, client) => {
                assert.ifError(e)
                const db = client.db(dbName)
                const collection = db.collection(documentName)
                collection.find({}).toArray((err, docs) => {
                    assert.equal(err, null)
                    console.log(docs)
                    client.close()
                    process.exit(0)
                })
            })
        }
    },
    'insert': {
        script: () => {
            if (process.argv.length < 4) {
                console.log("Usage: .document insert [filename]")
                process.exit(-1)
            }
            const uploadFile = `${__dirname}/static/${process.argv[3]}`
            const filename = process.argv[3]

            MongoClient.connect(url, (e, cli) => {
                assert.ifError(e)
                const db = cli.db(dbName)
                const bucket = new mongodb.GridFSBucket(db)
                fs.createReadStream(uploadFile)
                    .pipe(bucket.openUploadStream(filename))
                    .on('finish', () => {
                        console.log('success')
                        process.exit(0)
                    })
                    .on('error', (e) => assert.ifError(e))
            })
        }
    }
}

for (let name in operator)
    if (name === process.argv[2])
        return operator[name].script()

console.log(`Undefined [${process.argv[2]}]`)
