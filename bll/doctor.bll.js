var doctorDao = require('../dao/doctor.dao');
var patientDao = require('../dao/patient.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');
var loadService = require('../utils/loadContract');
var ethDoctorDao = require('../eth-dao/eth.doctor.dao');
var ethPatientDao = require('../eth-dao/eth.patient.dao');
var patientBll = require('../bll/patient.bll');
var encryptService = require('../bll/encrypt.bll');
var transferService = require('../utils/transfer');
var crypto = require('crypto');
var SHA256 = require("crypto-js/sha256");


const contractDoctorType = 'DOCTOR_CONTRACT';
const senderAccount = '0x7639B9129ddA354F32c54d370D7BF2a1F68DE279';
const senderPassword = 'passphrase-battery';

exports.registerDoctor = function (doctor, callback) {
    encryptService.generateKeys(doctor.username, (publicKey) => {
        ethDoctorDao.generateNewAccount(doctor.username, (account) => {
            transferService.transferMoneyToNewAccount(senderAccount, senderPassword, account, (result) => {
                let doctorToInsert = new UserModel({
                    username: doctor.username,
                    password: doctor.password,
                    role: doctor.role,
                    account: account,
                    accountPassword: doctor.username,
                    publicKey: publicKey
                });
                doctorDao.registerDoctor(doctorToInsert, callback);
            })
        })
    })
};

exports.deployDoctorContract = function (username, abi, bin, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        deployService.deploy(abi, bin, doctor[0].account, doctor[0].accountPassword, (address) => {
            let contractToInsert = new ContractModel({
                contractName: contractDoctorType,
                contractAddress: address,
                contractOwner: doctor[0].account
            });
            doctorDao.saveContract(contractToInsert, (data) => {
                callback(data)
            });
        });
    });
};

exports.registerUpdateContract = function (abi, username, doc, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.registerDoctorInContract(doctor[0].account, doctor[0].accountPassword, contractAddress, contract, doc, callback);
            });
        });
    });
};

exports.getDoctorData = function (abi, username, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.getDoctorDataFromContract(doctor[0].account, doctor[0].accountPassword, contract, (doc) => {
                    callback(doc);
                })
            });
        })
    });
};

exports.consultPatient = function (docAbi, patientAbi, ssn, patientUsername, doctorUsername, callback) {
    var md5sum = crypto.createHash('md5');
    var mystr = md5sum.update(patientUsername + ssn).digest('hex');
    doctorDao.getDoctorByUsername(doctorUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            loadService.loadContract(docAbi, docContractAddress, (contract) => {
                patientDao.getPatientByUsername(patientUsername, (patient) => {
                    if (patient.length > 0) {
                        patientDao.getContractAddressByAccount(patient[0].account, (patientContractAddress) => {
                            loadService.loadContract(patientAbi, patientContractAddress, (patientContract) => {
                                ethPatientDao.getPatientDataFromContract(patient[0].account, patient[0].accountPassword, patientContract, (patientData) => {
                                    if (patientData.identifier === mystr) {
                                        let data = ethDoctorDao.consultPatient(
                                            doctor[0].account,
                                            doctor[0].accountPassword,
                                            docContractAddress,
                                            contract,
                                            patient[0].account,
                                            patientContractAddress,
                                            ssn, (res) => {
                                                if (res) {
                                                    patientBll.addDoctorToPatientMap(patientAbi, patientUsername, doctor[0].account, 'TRUE', (response) => {
                                                        callback(response)
                                                    })
                                                }
                                            }
                                        );
                                    } else {
                                        callback({code: 500, error: 'No patient found'})
                                    }
                                })
                            })
                        })
                    } else {
                        callback({code: 500, error: 'No patient found'})
                    }
                })
            })
        })
    })
};

exports.getConsultedPatient = function (abi, username, patientUsername, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                patientDao.getPatientByUsername(patientUsername, (patient) => {
                    ethDoctorDao.getConsultedPatient(doctor[0].account,
                        doctor[0].accountPassword,
                        contract,
                        contractAddress,
                        patient[0].account,
                        (res) => {
                            callback(res);
                        })
                })
            })
        })
    })
};

exports.getAllConsultedPatients = function (abi, patientAbi, username, callback) {
    var patients = [];
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.getAllConsultedPatients(doctor[0].account,
                    doctor[0].accountPassword,
                    contract,
                    async (res) => {
                        console.log(res)
                        for (let i = 0; i < res.length; i++) {
                            let p = await patientBll.getPatientByAccount(res[i]);
                            console.log(p)
                            let obj = await patientBll.getPatientFromContractByUsername(patientAbi, p[0].username)
                            let myPatient = {
                                username: p[0].username,
                                identifier: obj.identifier,
                                donor: obj.donor,
                                receiver: obj.receiver
                            };
                            patients.push(myPatient)
                        }
                        callback(patients)
                    })
            })
        })
    })
};

exports.getRequests = function (abi, username, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.getRequests(doctor[0].account,
                    doctor[0].accountPassword,
                    contract,
                    (response) => {
                        callback(response)
                    })
            })
        })
    })
};