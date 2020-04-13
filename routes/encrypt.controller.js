var express = require('express');
var router = express.Router();
var encryptService = require('../bll/encrypt.bll');
var formidable = require('formidable');

router.post('/generateKeys', (req, res) => {
    encryptService.generateKeys();
});

router.post('/encryptFile', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        encryptService.encryptFile(fields.file, (data) => {
            res.send(data);
        })
    });

});

router.post('/decryptFile', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // console.log(fields);

        encryptService.decryptFile(fields.file, (data) => {
            // console.log(data);
            res.send(data);
        })
    });
});


module.exports = router;