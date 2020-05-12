var crypto = require('crypto');
var pdf = require('html-pdf')
var Duplex = require('readable-stream').Duplex;
var fs = require('fs');
var openpgp = require('openpgp');


exports.generateKeys = function (username, callback) {
    let keyOptions = {
        rsaBits: 2048,
        passphrase: 'something-secret',
        userIds: [{name: 'Jon Smith', email: 'jon@example.com'}]
    };

    openpgp.generateKey(keyOptions)
        .then((key) => {
            let publicKeyFile = 'public_' + username + '.txt';
            let privateKeyFile = 'private_' + username + '.txt';
            fs.writeFile(publicKeyFile, key.publicKeyArmored, null, (error) => {
                if (error) console.log(error);
                else {
                    fs.writeFile(privateKeyFile, key.privateKeyArmored, null, (error) => {
                        if (error) console.log(error);
                        callback(key.publicKeyArmored);
                    });
                }
            });
        })
        .catch((error) => {
            console.log(error);
        })
};

exports.encryptFile = function (file, username, callback) {

    var fileForEncrypt = new Buffer(file, 'binary');
    fs.writeFile('original.txt', fileForEncrypt, 'binary', (error) => {
        if (error) console.log(error);
        else console.log('saved in original.txt');
    });

    let publicKeyFile = 'public_' + username + '.txt';
    fs.readFile(publicKeyFile, 'utf8', async (error, publicKey) => {
        openpgp.initWorker({});
        const key = await openpgp.key.readArmored(publicKey);
        // console.log(openpgp.message.read(file))
        const options = {
            message: await openpgp.message.fromBinary(fileForEncrypt),
            publicKeys: key.keys
        };

        const encrypted = await openpgp.encrypt(options);

        fs.writeFile('encrypted.txt', encrypted.data, null, (error) => {
            if (error) console.log(error);
            else console.log('saved in encrypted.txt');
        });
        callback(encrypted.data);

        if (error) console.log(error);

    })


};

exports.decryptFile = function (file, username, callback) {
    let privateKeyFile = 'private_' + username + '.txt';
    fs.readFile(privateKeyFile, 'utf8', async (error, pkey) => {

        openpgp.initWorker({});
        const privateKey = await openpgp.key.readArmored(pkey);

        let privateKeyForDecrypt = privateKey.keys[0];
        await privateKeyForDecrypt.decrypt('something-secret');
        let msj = await openpgp.message.readArmored(file);

        const options = {
            message: msj,
            privateKeys: privateKeyForDecrypt,
            format: 'binary'
        };


        const decrypted = openpgp.decrypt(options)
            .then((decrypted) => {
                let decryptedPath = 'file_' + username + '.txt';
                fs.writeFile(decryptedPath, decrypted.data, {encoding: 'binary'}, (error) => {
                    if (error) callback(error);
                });
                fs.open('content.pdf', 'w', (err, fd) => {

                    if (err) {
                        return;
                    }

                    fs.writeFile(fd, decrypted.data, {encoding: 'binary'}, (error) => {
                        if (error) callback(error);
                    });
                });
                callback(decrypted.data);

            })
            .catch((error) => {
                callback(error)
            });

    })
};
