var doctorDao = require('../dao/doctor.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');
var loadService = require('../utils/loadContract');
var ethDoctorDao = require('../eth-dao/eth.doctor.dao');

const contractDoctorType = 'DOCTOR_CONTRACT';
exports.registerDoctor = function (doctor, callback) {
    let doctorToInsert = new UserModel({
        username: doctor.username,
        password: doctor.password,
        account: doctor.account,
        accountPassword: doctor.accountPassword
    });
    doctorDao.registerDoctor(doctorToInsert, callback);
};

exports.deployDoctorContract = function (username, abi, bin) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        deployService.deploy(abi, bin, doctor[0].account, doctor[0].accountPassword, (address) => {
            let contractToInsert = new ContractModel({
                contractName: contractDoctorType,
                contractAddress: address,
                contractOwner: doctor[0].account
            });
            doctorDao.saveContract(contractToInsert);
        });
    });
};

exports.registerUpdateContract = function (abi, username, doc) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        console.log(doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.registerDoctorInContract(doctor[0].account, doctor[0].accountPassword, contractAddress, contract, doc, (data)=>{
                    console.log(data ,' from bll');
                    //TODO: CALLBACK -> TO USE RES.SEND IN CONTROLLER ???
                });
            });
        });
    });
}

exports.getDoctorData = function (abi, username,callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        console.log(doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            console.log("Contract address: ", contractAddress);
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.getDoctorDataFromContract(doctor[0].account, doctor[0].accountPassword,contract, (doc)=>{
                    console.log("From blockchain: ", doc);
                    callback(doc);
                })
            });
        })
    });
}

exports.consultPatient = function(patientUsername, doctorUsername, contract){
    doctorDao.getDoctorByUsername(doctorUsername, (doctor) =>{

    })
}
