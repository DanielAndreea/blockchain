var doctorDao = require('../dao/doctor.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');

const contractDoctorType = 'DOCTOR_CONTRACT';
exports.registerDoctor = function (doctor, callback) {
    let doctorToInsert = new UserModel({
        username: doctor.username,
        password: doctor.password,
        account: doctor.account,
        accountPassword: doctor.accountPassword
    });
    doctorDao.registerDoctor(doctorToInsert, callback);
}

exports.deployDoctorContract = function (username, abi, bin) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        deployService.deploy(abi, bin, doctor[0].account, doctor[0].accountPassword, (address) => {
            let contractToInsert = new ContractModel({
                contractName: contractDoctorType,
                contractAddress: address,
                contractOwner: doctor[0].account
            })
            doctorDao.saveContract(contractToInsert);
        })
    })
}
// (string memory _firstName, string memory _lastName, uint256 _age, uint _specialization)
exports.registerUpdateContract = function (abi, username, doc) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        console.log(doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            var contract = new web3.eth.Contract(abi, contractAddress);
            web3.eth.personal.unlockAccount(doctor[0].account, doctor[0].accountPassword, null, (err) => {
                if (err) console.log(err);
                web3.eth.sendTransaction({
                    to: contractAddress,
                    from: doctor[0].account,
                    data: contract.methods.register(doc.firstName, doc.lastName, doc.age, doc.specialization).encodeABI()
                })
                    .then((data) => console.log(data))
                    .catch(console.log);
            })
        })
    })
}

exports.getDoctorData = function (abi, account, password) {
    doctorDao.getContractAddressByAccount(account, (contractAddress) => {
        console.log("Contract address: ", contractAddress);
        var contract = new web3.eth.Contract(abi, contractAddress);
        web3.eth.personal.unlockAccount(account, password, null, (err) => {
            if (err) console.log(err);
            contract.methods.owner().call(console.log);
            contract.methods.firstName().call(console.log);
            contract.methods.age().call(console.log);
            contract.methods.specialization().call(console.log);
        })
    })
}