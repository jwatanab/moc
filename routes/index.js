const express = require('express')
const assert = require('assert')
const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()

// item
const url = 'mongodb://localhost:27017'
const dbName = 'archiveMoc'
const fs_collection = 'fs.files'

router.get('/', (req, res, next) => {
    res.render('index')
})

router.post('/content', (req, res) => {
    MongoClient.connect(url, (e, c) => {
        assert.ifError(e)
        const db = c.db(dbName)
        const collection = db.collection(fs_collection)

        collection.findOne({ 'filename': req.query.filename })
            .then((e) => {
                let content = []
                const ins = new mongodb.GridFSBucket(db)
                const downloadStream = ins.openDownloadStreamByName(e.filename)
                downloadStream.on('data', (chunk) => content.push(new Buffer(chunk)))
                downloadStream.on('error', (e) => res.json(e))
                downloadStream.on('end', () => res.send(Buffer.concat(content)))
            })
            .catch((e) => res.redirect('/'))
    })
})

router.post('/main_init', (req, res) => {
    MongoClient.connect(url, (e, c) => {
        assert.ifError(e)
        const db = c.db(dbName)
        const collection = db.collection(fs_collection)

        collection.findOne({ 'filename': req.query.name })
            .then((e) => {
                let content = []
                const ins = new mongodb.GridFSBucket(db)
                const downloadStream = ins.openDownloadStreamByName(e.filename)
                downloadStream.on('data', (chunk) => content.push(new Buffer(chunk)))
                downloadStream.on('error', (e) => res.json(e))
                downloadStream.on('end', () => res.send(Buffer.concat(content)))
            })
            .catch((e) => res.redirect('/'))
    })
})

module.exports = router
