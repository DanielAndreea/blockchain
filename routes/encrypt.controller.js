var express = require('express');
var router = express.Router();
var encryptService = require('../bll/encrypt.bll');
var formidable = require('formidable');
var path = require('path')
var fs = require('fs');

router.post('/generateKeys', (req, res) => {
    encryptService.generateKeys(req.body.username, (data) => {
        console.log(data)
        res.send(data)
    });
});

router.post('/encryptFile', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log(fields)
        console.log(files)
        encryptService.encryptFile(fields.file, fields.username, (data) => {
            res.send(data);
        })
    });

});

router.post('/decryptFile', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        encryptService.decryptFile(fields.file, fields.username, (data) => {
            res.send(data)
        })
    });
});

router.get('/download/:username', (req, res) => {
    let file = 'file_' + req.params.username + '.txt';
    fs.readFile(file, (err, data) => {
        if (err) console.log(err);
        res.send(new Buffer(data, 'binary'));
    });
});

module.exports = router;