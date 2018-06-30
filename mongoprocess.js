const
    fs = require('fs'),
    mongodb = require('mongodb'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017',
    dbName = 'archiveMoc',
    read = require('readline'),
    stdin = read.createInterface({ input: process.stdin })

/**
 * @param {String} mode 
 * @param {Object} stdin
 */
const waring = (mode, stdin) => {
    console.log(`want to run the ${mode} process? y : n`)
    read.createInterface({ input: process.stdin }).once('line', (e) => {
        if (e === 'y') {
            stdin.close()
        } else if (e === 'n') {
            console.log('exit the process')
            process.exit(0)
        } else {
            console.log('exit the process')
            process.exit(0)
        }
    })
}

let
    operator,
    binaryOperator,
    usersOperator

if (require.main !== module) return

// target table users
usersOperator = {
    'view': {
        script: () => {
            if (process.argv.length < 3) {
                console.log("Usage: mongodb view")
                process.exit(-1)
            }
            MongoClient.connect(url, (e, client) => {
                assert.ifError(e)
                const db = client.db(dbName)
                const collection = db.collection(documentName)
                collection.find({}).toArray((err, docs) => {
                    assert.equal(err, null)
                    for (const i in docs) {
                        console.log(`audioName: ${docs[i].audioName}`)
                        console.log(`imgName:   ${docs[i].imgName}`)
                    }
                    client.close()
                    process.exit(0)
                })
            })
        }
    }, 'insert': {
        script: () => {
            if (process.argv.length < 4) {
                console.log("Usage: mongodb insert [audioName] [imgName]")
                process.exit(-1)
            }
            MongoClient.connect(url, (e, client) => {
                assert.ifError(e)
                const db = client.db(dbName)
                const collection = db.collection(documentName)
                collection.insertMany([{
                    audioName: process.argv[3],
                    imgName: process.argv[4],
                }], (e, result) => {
                    assert.ifError(e)
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);
                    console.log(`Inserted 1 documents into the ${documentName}`);
                    client.close();
                });
            })
        }
    }, 'update': {
        script: () => {
            if (process.argv.length < 5) {
                console.log("Usage: mongodb insert [audioName] [imgName]")
                process.exit(-1)
            }
            MongoClient.connect(url, (e, client) => {
                assert.ifError(e)
                const db = client.db(dbName)
                const collection = db.collection(documentName)
                // collection.updateOne(), (e, result) => {
                //     // assert.ifError(e)
                //     // assert.equal(1, result.result.n);
                //     // assert.equal(1, result.ops.length);
                //     // console.log(`Inserted 1 documents into the ${documentName}`);
                //     // client.close();
                // });
                collection.updateOne({ 'filename': process.argv[4], $set: { exe: process.argv[5] } }, (e, result) => {
                    assert.ifError(e)
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);
                    console.log(`Update 1 documents into the ${documentName}`);
                })
            })
        }
    }, 'remove': {
        script: () => {
            if (process.argv.length < 3) {
                console.log("Usage: mongodb remove")
                process.exit(-1)
            }
            MongoClient.connect(url, (e, client) => {
                assert.ifError(e)
                const db = client.db(dbName)
                const collection = db.collection(documentName)
                collection.removeMany()
                console.log(`remove all documents into the ${documentName}`);
                client.close();
            })
        }
    }
}

// target table fs
binaryOperator = {
    'view': {
        script: () => {
            if (process.argv.length < 3) {
                console.log("Usage: mongodb view")
                process.exit(-1)
            }
            MongoClient.connect(url, (e, client) => {
                assert.ifError(e)
                const db = client.db(dbName)
                const collection = db.collection(documentName)
                collection.find().toArray((e, docs) => {
                    assert.ifError(e)
                    for (const i in docs) {
                        console.log(`fileName: ${docs[i].filename}`)
                    }
                    client.close()
                    process.exit(0)
                })
            })
        }
    }, 'insert': {
        script: () => {
            if (process.argv.length < 4) {
                console.log("Usage: mongodb insert [filename]")
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
                        console.log(`Inserted ${filename} into the ${documentName}`)
                        process.exit(0)
                    })
                    .on('error', (e) => assert.ifError(e))
            })
        }
    }, 'remove': {
        script: () => {
            if (process.argv.length < 3) {
                console.log("Usage: mongodb remove")
                process.exit(-1)
            }
            MongoClient.connect(url, (e, client) => {
                assert.ifError(e)
                const db = client.db(dbName)
                const collection = db.collection(documentName)
                collection.removeMany()
                console.log(`remove all documents into the ${documentName}`);
                client.close();
            })
        }
    }
}



// operation mode select change
console.log('Please select the mode')
stdin.once('line', (mode) => {
    if (mode === 'binary') {
        operator = binaryOperator
        documentName = 'fs.files'
        if (process.argv[2] === 'remove') {
            return waring('remove', stdin)
        }
        stdin.close()
    } else if (mode === 'text') {
        operator = usersOperator
        documentName = 'users'
        if (process.argv[2] === 'remove') {
            return waring('remove', stdin)
        }
        stdin.close()
    } else {
        throw new ReferenceError(`Not Found ${mode}`)
        process.exit(-1)
    }
})

stdin.once('close', (e) => {
    // execute
    for (let name in operator) {
        if (name === process.argv[2]) {
            return operator[name].script()
        }
    }
    throw new SyntaxError(`Undefined: operator.${process.argv[2]}`)
})
