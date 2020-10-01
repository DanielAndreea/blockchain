var fs = require('fs');
var openpgp = require('openpgp');
var userService = require('./user.bll')

// reference: https://openpgpjs.org/openpgpjs/doc/
exports.generateKeys = function (username, callback) {
    let keyOptions = {
        rsaBits: 2048,
        passphrase: 'something-secret',
        userIds: [{name: 'andreea', email: 'andreea@example.com'}]
    };

    openpgp.generateKey(keyOptions)
        .then((key) => {
            let publicKeyFile = 'public_' + username + '.txt';
            let privateKeyFile = 'private_' + username + '.txt';
            fs.writeFile(publicKeyFile, key.publicKeyArmored, null, (error) => {
                if (error) console.log(error);
                else {
                    fs.writeFile(privateKeyFile, key.privateKeyArmored, null, (error) => {
                        if (error) callback(error);
                        callback(key.publicKeyArmored);
                    });
                }
            });
        })
        .catch((error) => {
            callback(error);
        })
};

exports.encryptFile = function (file, username, callback) {
    var fileForEncrypt = new Buffer(file, 'binary');

    let publicKeyFile = 'public_' + username + '.txt';
    userService.getPublicKeyByUser(username, async (user, error) => {
        openpgp.initWorker({});
        const key = await openpgp.key.readArmored(user[0].publicKey);

        const options = {
            message: await openpgp.message.fromBinary(fileForEncrypt),
            publicKeys: key.keys
        };

        const encrypted = await openpgp.encrypt(options);

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

                callback(decrypted.data);

            })
            .catch((error) => {
                callback(error)
            });
    })
};
