var patientDao = require('../../dao/patient-dao/patient.dao');
var UserModel = require('../../models/user.model');
var ContractModel = require('../../models/contract.model');

const contractPatientType = 'PATIENT_CONTRACT';
exports.registerPatient = function (patient, contractAddress) {
    console.log('RECEIVED CONTRACT ADDRESS: ', contractAddress);
    let patientToInsert = new UserModel({
        username: patient.username,
        password: patient.password,
        account: patient.account,
        accountPassword: patient.accountPassword
    })

    patientDao.registerPatient(patientToInsert);
}


exports.deployPatientContract = function (account, password, abi, bin, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) {
            console.log('Account cannot be unlocked ', err);
        } else {
            console.log("Account unlocked!");
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
                // callback(instance.options.address)
                let contractToInsert = new ContractModel({
                    contractName: contractPatientType,
                    contractAddress: instance.options.address,
                    contractOwner: account
                })
                patientDao.saveContract(contractToInsert);
                callback(instance.options.address);
                // return instance.options.address;
            })
            .catch(console.log);
    })
}


exports.registerUpdateContract = function (abi, account, password) {
    //load contract
    patientDao.getPatientIdentifier(account, (identifier) => {
        console.log('IDENTIFIER: ', identifier);
        patientDao.getContractAddressByAccount(account, (contractAddress) => {
            console.log('CONTRACT ADDRESS: ', contractAddress);
            var contract = new web3.eth.Contract(abi, contractAddress);
            web3.eth.personal.unlockAccount(account, password, null, (err) => {
                if (err) console.log(err);
                web3.eth.sendTransaction({
                    to: contractAddress,
                    from: account,
                    data: contract.methods.register(identifier.toString()).encodeABI()
                })
                    .then((data) => console.log(data))
                    .catch(console.log);
            })
        });
    });
}

exports.getPatientData = function(abi,account,password){
    patientDao.getContractAddressByAccount(account, (contractAddress) => {
        console.log('CONTRACT ADDRESS: ', contractAddress);
        var contract = new web3.eth.Contract(abi, contractAddress);
        web3.eth.personal.unlockAccount(account, password, null, (err,data) => {
            if (err) console.log(err);
            contract.methods.owner().call(console.log);
        })
    });
}
