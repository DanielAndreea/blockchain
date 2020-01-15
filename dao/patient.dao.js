var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');

exports.registerPatient = function (patientToInsert,callback) {
    patientToInsert.save()
        .then(data => {
            console.log('SAVED PATIENT TO DB: ', data);
            // saveContract(contract);
            callback(data);
        })
        .catch(error => console.log('FROM PATIENT DAO ', error));
}

exports.saveContract = function (contractToInsert) {
    contractToInsert.save()
        .then(data => {
            console.log('SAVED CONTRACT TO DB: ', data);
        })
        .catch(error => console.log('FROM PATIENT DAO ', error));
}

exports.getPatientIdentifier = function (username, callback) {
    UserModel.find({username: username})
        .then((data) => {
            console.log(data[0]._id);
            callback(data[0]._id);
        })
        .catch(console.log);
}

exports.getPatientByUsername = function(username, callback){
    UserModel.find({username: username})
        .then( (data) =>{
            console.log('data ',data);
            callback(data);
        })
        .catch(console.log);
}

exports.getContractAddressByAccount = function (account, callback) {
    ContractModel.find({contractOwner: account})
        .then((contract) => {
            console.log(contract[0]);
            callback(contract[0].contractAddress);
        })
        .catch(console.log);
}