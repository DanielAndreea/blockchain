var userDao = require('../dao/user.dao');
var contractService = require('./contract.bll');
var constants = require('../utils/constants');

var ursa = require('ursa');


exports.getAllUsers = function (callback) {
    userDao.getAllUsers((result) => callback(result));
    var key = ursa.generatePrivateKey(1024, 65537);
    var privkeypem = key.toPrivatePem();
    var pubkeypem = key.toPublicPem();

    console.log(privkeypem.toString('ascii'));
    console.log(pubkeypem.toString('ascii'));
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