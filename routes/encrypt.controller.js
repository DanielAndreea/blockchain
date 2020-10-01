var express = require('express');
var router = express.Router();
var encryptService = require('../bll/encrypt.bll');
var formidable = require('formidable');
var path = require('path')
var fs = require('fs');

router.post('/generateKeys', (req, res) => {
    encryptService.generateKeys(req.body.username, (data) => {
        res.send(data)
    });
});

router.post('/encryptFile', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
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
    if (fs.existsSync(file)) {
        fs.readFile(file, (err, data) => {
            if (err) res.send(err);
            fs.unlink(file, (err) => {
                if (err) res.send(err);
                res.send(new Buffer(data, 'binary'));
            });
        });
    } else {
        res.send({code: 500, message: 'No permission'});
    }

});

module.exports = router;