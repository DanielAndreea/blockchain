var ContractModel = require('../models/contract.model');

exports.getAllContracts = function (callback) {
    ContractModel.find({})
        .then((list) => {
            console.log(list);
            callback(list);
        })
        .catch(console.log);
}