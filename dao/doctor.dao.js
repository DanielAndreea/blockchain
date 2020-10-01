var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');

exports.registerDoctor = function (doctorToInsert, callback) {
    doctorToInsert.save()
        .then(data => {
            callback(data);
        })
        .catch(error => callback(error));
};

exports.saveContract = function (contractToInsert, callback) {
    contractToInsert.save()
        .then(data => {
            callback(data)
        })
        .catch(error => callback(error));
};

exports.getDoctorByUsername = function (username, callback) {
    UserModel.find({username: username})
        .then((data) => {
            callback(data);
        })
        .catch(console.log);
};

exports.getDoctorByAccount = function (account, callback) {
    UserModel.find({account: account})
        .then((data) => {
            callback(data);
        })
        .catch(console.log);
};

exports.getContractAddressByAccount = function (account, callback) {
    ContractModel.find({contractOwner: account})
        .then((contract) => {
            callback(contract[0].contractAddress);
        })
        .catch(console.log);
};

