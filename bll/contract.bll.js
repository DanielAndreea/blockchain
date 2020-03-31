var contractDao = require('../dao/contract.dao');

exports.getAllContracts = function(callback){
    contractDao.getAllContracts((result) => callback(result));
}