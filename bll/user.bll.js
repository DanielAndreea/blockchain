var userDao = require('../dao/user.dao');
var contractService = require('./contract.bll');
var constants = require('../utils/constants');
var UserModel = require('../models/user.model');


exports.login = function (username, password, callback) {
    try {
        UserModel.findOne({username: username})
            .then((user) => {
                if(user) {
                    if(user.password === password) callback(user);
                    else callback('Wrong credentials');
                }
                else callback('Wrong credentials');
            })
            .catch((error) => console.log(error))
    } catch (error) {
        callback(error);
    }
};
exports.getAllUsers = function (callback) {
    userDao.getAllUsers((result) => callback(result));
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