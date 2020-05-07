var ContractModel = require('../models/contract.model');

exports.getAllContracts = function (callback) {
    ContractModel.find({})
        .then((list) => {
            callback(list);
        })
        .catch((error) => callback(error));
};

exports.getContractByType = function (type, callback) {
    ContractModel.find({contractName: type})
        .then((obj) => callback(obj))
        .catch((error) => callback(error))
};