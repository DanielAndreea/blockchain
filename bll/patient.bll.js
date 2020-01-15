var patientDao = require('../dao/patient.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');

const contractPatientType = 'PATIENT_CONTRACT';
exports.registerPatient = function (patient,callback) {
    let patientToInsert = new UserModel({
        username: patient.username,
        password: patient.password,
        account: patient.account,
        accountPassword: patient.accountPassword
    })

    patientDao.registerPatient(patientToInsert,callback);
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
            var contract = new web3.eth.Contract(abi, contractAddress);
            web3.eth.personal.unlockAccount(patient[0].account, patient[0].accountPassword, null, (err) => {
                if (err) console.log(err);
                web3.eth.sendTransaction({
                    to: contractAddress,
                    from: patient[0].account,
                    data: contract.methods.register(patient[0]._id.toString()).encodeABI()
                })
                    .then((data) => console.log(data))
                    .catch(console.log);
            })
        });
    });
}


exports.getPatientData = function (abi, account, password) {
    patientDao.getContractAddressByAccount(account, (contractAddress) => {
        console.log('CONTRACT ADDRESS: ', contractAddress);
        var contract = new web3.eth.Contract(abi, contractAddress);
        web3.eth.personal.unlockAccount(account, password, null, (err, data) => {
            if (err) console.log(err);
            contract.methods.owner().call(console.log);
        })
    });
}
