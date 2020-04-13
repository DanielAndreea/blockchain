var userDao = require('../dao/user.dao');
var contractService = require('./contract.bll');
var constants = require('../utils/constants');
var crypto = require('crypto');
// var ursa = require('ursa');
var fs = require('fs');

exports.getAllUsers = function (callback) {
    userDao.getAllUsers((result) => callback(result));
    // crypto.generateKeyPair('rsa', {
    //     modulusLength: 4096,
    //     publicKeyEncoding: {
    //         type: 'spki',
    //         format: 'pem'
    //     },
    //     privateKeyEncoding: {
    //         type: 'pkcs8',
    //         format: 'pem',
    //         cipher: 'aes-256-cbc',
    //         passphrase: 'top secret'
    //     }
    // }, (err, publicKey, privateKey) => {
    //     // Handle errors and use the generated key pair.
    //     console.log("SECOND PUBLIC KEY: ", publicKey);
    //     console.log("SECOND PRIVATE KEY: ", privateKey);
    //
    //     fs.writeFile('public.pem', publicKey, null, (error) => {
    //         if (error) console.log(error);
    //         else console.log('saved in public.txt');
    //     });
    //
    //     fs.writeFile('private.pem', privateKey, null, (error) => {
    //         if (error) console.log(error);
    //         else console.log('saved in private.txt');
    //     });
    //
    // });
};

exports.getPatientUsers = function (callback) {
    var patients = [];
    contractService.getAllContracts((contracts) => {
        this.getAllUsers((users) => {
            users.forEach((user) => {
                contracts.forEach((contract) => {
                    if (contract.contractName === constants.CONTRACT_TYPE.PATIENT_CONTRACT) {
                        if (contract.contractOwner === user.account) {
                            patients.push(user);
                        }
                    }
                })
            });
            callback(patients);
        })
    });
};