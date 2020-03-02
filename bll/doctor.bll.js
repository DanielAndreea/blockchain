var doctorDao = require('../dao/doctor.dao');
var patientDao = require('../dao/patient.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');
var loadService = require('../utils/loadContract');
var ethDoctorDao = require('../eth-dao/eth.doctor.dao');
var patientBll = require('../bll/patient.bll');

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
                ethDoctorDao.registerDoctorInContract(doctor[0].account, doctor[0].accountPassword, contractAddress, contract, doc, (data) => {
                    console.log(data, ' from bll');
                    //TODO: CALLBACK -> TO USE RES.SEND IN CONTROLLER ???
                });
            });
        });
    });
}

exports.getDoctorData = function (abi, username, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        console.log(doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            console.log("Contract address: ", contractAddress);
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.getDoctorDataFromContract(doctor[0].account, doctor[0].accountPassword, contract, (doc) => {
                    console.log("From blockchain: ", doc);
                    callback(doc);
                })
            });
        })
    });
}

exports.consultPatient = function (docAbi, patientAbi, patientUsername, doctorUsername) {
    doctorDao.getDoctorByUsername(doctorUsername, (doctor) => {
        console.log('Doctor returned by username: ', doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            console.log('Contract address for doctor: ', docContractAddress);
            loadService.loadContract(docAbi, docContractAddress, (contract) => {
                patientDao.getPatientByUsername(patientUsername, (patient) => {
                    console.log('Patient returned by username: ', patient);
                    patientDao.getContractAddressByAccount(patient[0].account, (patientContractAddress) => {
                        console.log('Contract address for patient: ', patientContractAddress);
                        let data = ethDoctorDao.consultPatient(
                            doctor[0].account,
                            doctor[0].accountPassword,
                            docContractAddress,
                            contract,
                            patient[0].account,
                            patientContractAddress, (res) => {
                                if (res) {
                                    console.log('Returned from Eth dao: ', res);
                                    // ethPatientDao.addDoctorToPatientMap(patient[0].account, patient[0].accountPassword,docContractAddress, 'TRUE')
                                    patientBll.addDoctorToPatientMap(patientAbi, patientUsername, docContractAddress, 'TRUE', (response) => {
                                        console.log('done ', response);
                                    })
                                } else console.log('NO DATA RETURNED')
                            }
                        );

                        //if data exists call eth dao from patient AND CALL method


                    })
                })
            })
        })
    })
}
