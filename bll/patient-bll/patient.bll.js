var patientDao = require('../../dao/patient-dao/patient.dao');
var UserModel = require('../../models/user.model');
var ContractModel = require('../../models/contract.model');


exports.registerPatient = function (patient, contract) {
    let patientToInsert = new UserModel({
        userIdentifier: patient.userIdentifier,
        username: patient.username,
        password: patient.password,
        account: patient.account,
        accountPassword: patient.accountPassword
    })

    let contractToInsert = new ContractModel({
        idContract: contract.idContract,
        contractName: contract.contractName,
        contractAddress: contract.contractAddress,
        contractOwner: patient.account
    })

    patientDao.registerPatient(patientToInsert, contractToInsert);
}


exports.deployPatientContract = function (account, password, abi, bin) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) {
            console.log('Account cannot be unlocked ', err);
        } else {
            console.log("Account unlocked!");
            console.log("ABI: ", abi);
            console.log("BIN: ", bin);
        }

        const patientContract = new web3.eth.Contract(abi);
        patientContract.deploy({
            data: bin
        })
            .send({
                from: account,
                gas: 1000000
            })
            .then((instance) => {
                console.log("CONTRACT DEPLOYED AT ADDRESS: ", instance.options.address);
                return instance.options.address;
            })
            .catch(console.log);
    })
}
