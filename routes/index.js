const express = require('express');
const assert = require('assert');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

// item
const url = 'mongodb://localhost:27017';
const dbName = 'archiveMoc';
const fs_collection = 'fs.files';

router.get('/', function (req, res, next) {
    res.render('index');
});

router.post('/content', function (req, res) {
    MongoClient.connect(url, function (e, c) {
        assert.ifError(e);
        const db = c.db(dbName);
        const collection = db.collection(fs_collection);

        const t = 'Serato_Recording.m4a'
        collection.findOne({ 'filename': t })
            .then(function (e) {
                let content = [];
                const ins = new mongodb.GridFSBucket(db);
                const downloadStream = ins.openDownloadStreamByName(e.filename);
                downloadStream.on('data', function (chunk) {
                    content.push(new Buffer(chunk));
                });
                downloadStream.on('error', function (e) {
                    return res.json(e);
                });
                downloadStream.on('end', function () {
                    return res.send(Buffer.concat(content));
                });
            })
            .catch(function (e) {
                res.redirect('/');
            });
    });
});

router.post('/main_init', function (req, res) {
    MongoClient.connect(url, function (e, c) {
        assert.ifError(e);
        const db = c.db(dbName);
        const collection = db.collection(fs_collection);

        collection.findOne({ 'filename': req.query.name })
            .then(function (e) {
                let content = [];
                const ins = new mongodb.GridFSBucket(db);
                const downloadStream = ins.openDownloadStreamByName(e.filename);
                downloadStream.on('data', function (chunk) {
                    content.push(new Buffer(chunk));
                });
                downloadStream.on('error', function (e) {
                    return res.json(e);
                });
                downloadStream.on('end', function () {
                    return res.send(Buffer.concat(content));
                });
            })
            .catch(function (e) {
                res.redirect('/');
            });
    });
})

module.exports = router;
