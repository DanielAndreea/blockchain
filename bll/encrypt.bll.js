var crypto = require('crypto');
var pdf = require('html-pdf')
var Duplex = require('readable-stream').Duplex;
var fs = require('fs');
var openpgp = require('openpgp');


exports.generateKeys = function () {
    let keyOptions = {
        rsaBits: 2048,
        passphrase: 'something-secret',
        userIds: [{name: 'Jon Smith', email: 'jon@example.com'}]
    };

    openpgp.generateKey(keyOptions)
        .then((key) => {
            fs.writeFile('public.txt', key.publicKeyArmored, null, (error) => {
                if (error) console.log(error);
                else console.log('Public key saved in public.txt');
            });

            fs.writeFile('private.txt', key.privateKeyArmored, null, (error) => {
                if (error) console.log(error);
                else console.log('Private key saved in private.txt');
            });
        })
        .catch((error) => {
            console.log(error);
        })
};

exports.encryptFile = function (file, callback) {
    // const fileForEncrypt = new Uint8Array(file.length);
    // //console.log(file);
    // // console.log(fileForEncrypt)
    // for (var i = 0; i < Object.keys(file).length; i++) {
    //     fileForEncrypt[i] = file.charCodeAt(i);
    // }
    var fileForEncrypt = new Buffer(file, 'binary');
    fs.writeFile('original.txt', fileForEncrypt, 'binary', (error) => {
        if (error) console.log(error);
        else console.log('saved in original.txt');
    });
    fs.readFile('public.txt', 'utf8', async (error, publicKey) => {
        openpgp.initWorker({});
        const key = await openpgp.key.readArmored(publicKey);
        // console.log(openpgp.message.read(file))
        const options = {
            message: await openpgp.message.fromBinary(fileForEncrypt),
            publicKeys: key.keys
        };

        const encrypted = await openpgp.encrypt(options);

        // console.log(data)
        // const encryptedFile = data.message.packets.write();
        fs.writeFile('encrypted.txt', encrypted.data, null, (error) => {
            if (error) console.log(error);
            else console.log('saved in encrypted.txt');
        });
        callback(encrypted.data);

        if (error) console.log(error);


        // var buffer = new Buffer(file, 'binary');
        // console.log(buffer)
        // // const privateKeyObject = crypto.createPrivateKey(privateKey);
        // // const publicKeyObject = crypto.createPublicKey(data);
        // var encrypted = crypto.publicEncrypt({
        //     key: data,
        //     padding: crypto.constants.RSA_NO_PADDING
        // }, buffer);
        // fs.writeFile('encrypted.txt', encrypted, null, (error) => {
        //     if (error) console.log(error);
        //     else console.log('saved in encrypted.txt');
        // });
    })


};

exports.decryptFile = function (file, callback) {
    fs.readFile('private.txt', 'utf8', async (error, pkey) => {

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

        const decrypted = await openpgp.decrypt(options);
        console.log(decrypted)

        fs.writeFile('decrypted-final.txt', decrypted.data, null, (error) => {
            if (error) console.log(error);
            else console.log('saved in decrypted.txt');
        });
        fs.open('content.pdf', 'w', (err, fd) => {

            if (err) {
                console.log("trist");
                return;
            }
            const bufferData = Buffer.from(decrypted.data, 'binary');
            console.log("BUF LENGTH: " + bufferData.length);
            fs.writeFile(fd, decrypted.data, {encoding: 'binary'}, (error) => {
                if (error) console.log(error);
                else console.log('saved');
            });
        });
        callback(decrypted);
    })



//     var buffer = new Buffer(file, 'binary');
//     // var mykey = crypto.createDecipher('aes-128-cbc', data);
//     // mykey.setAutoPadding(false);
//     // var mystr = mykey.update(file, 'binary', 'binary') + mykey.final('binary');
//     var decrypted = crypto.privateDecrypt(
//         {
//             key: data.toString(),
//             passphrase: 'top secret'
//         },
//         buffer
//     );
//
//     fs.writeFile('encrypted.txt', file, null, (error) => {
//         if (error) console.log(error);
//         else console.log('saved in encrypted.txt');
//     });
//
//     fs.writeFile('decrypted.txt', decrypted, null, (error) => {
//         if (error) console.log(error);
//         else console.log('saved in decrypted.txt');
//     });
//
//     fs.open('content.pdf', 'w', (err, fd) => {
//
//         if (err) {
//             console.log("trist");
//             return;
//         }
//         const bufferData = Buffer.from(decrypted, 'binary');
//         console.log("BUF LENGTH: " + bufferData.length);
//         fs.writeFile(fd, decrypted, {encoding: 'binary'}, (error) => {
//             if (error) console.log(error);
//             else console.log('saved');
//         });
//     });
// })
//console.log(mystr); //abc


// const pdf = pdfjs.getDocument({data: file});
//this.generatePdf(mystr, res);
}
;

function bufferToStream(buffer) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

exports.generatePdf = (req, res) => {
    var html = 'somehtmlfile.html'
    pdf.create(html).toBuffer(function (err, buffer) {
        if (err) {
            console.log(err)
        } else {
            console.log(buffer);
            bufferToStream(buffer).pipe(res)
        }
    })
};