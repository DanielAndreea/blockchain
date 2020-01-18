var patientDao = require('../dao/patient.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');
var ethPatientDao = require('../eth-dao/eth.patient.dao');
var loadService = require('../utils/loadContract');

const contractPatientType = 'PATIENT_CONTRACT';
exports.registerPatient = function (patient, callback) {
    let patientToInsert = new UserModel({
        username: patient.username,
        password: patient.password,
        account: patient.account,
        accountPassword: patient.accountPassword
    });
    patientDao.registerPatient(patientToInsert, callback);
}


exports.deployPatientContract = function (username, abi, bin) {
    patientDao.getPatientByUsername(username, (patient) => {
        deployService.deploy(abi, bin, patient[0].account, patient[0].accountPassword, (address) => {
            let contractToInsert = new ContractModel({
                contractName: contractPatientType,
                contractAddress: address,
                contractOwner: patient[0].account
            })
            patientDao.saveContract(contractToInsert);
        })
    })
}


exports.registerUpdateContract = function (abi, username) {
    patientDao.getPatientByUsername(username, (patient) => {
        console.log(patient);
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                const data = ethPatientDao.registerPatientInContract(patient[0].account, patient[0].accountPassword, contractAddress, contract, "newId");
                return data;
            });
        });
    });

}


exports.getPatientData = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getPatientDataFromContract(patient[0].account, patient[0].accountPassword, contract, (patient) => {
                    console.log("From blockchain: ", patient);
                    callback(patient);
                })
            });
        });
    })
}
