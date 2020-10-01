var patientDao = require('../dao/patient.dao');
var doctorDao = require('../dao/doctor.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');
var ethPatientDao = require('../eth-dao/eth.patient.dao');
var ethDoctorDao = require('../eth-dao/eth.doctor.dao');
var loadService = require('../utils/loadContract');
var encryptService = require('../bll/encrypt.bll');
const contractPatientType = 'PATIENT_CONTRACT';
var crypto = require('crypto');
var transferService = require('../utils/transfer');
const senderAccount = '0x7639B9129ddA354F32c54d370D7BF2a1F68DE279';
const senderPassword = 'passphrase-battery';

exports.registerPatient = function (patient, callback) {
    encryptService.generateKeys(patient.username, (publicKey) => {
        ethPatientDao.generateNewAccount(patient.username, (account) => {
            transferService.transferMoneyToNewAccount(senderAccount, senderPassword, account, (result) => {
                let patientToInsert = new UserModel({
                    username: patient.username,
                    password: patient.password,
                    role: patient.role,
                    account: account,
                    accountPassword: patient.username,
                    publicKey: publicKey
                });
                patientDao.registerPatient(patientToInsert, callback);
            })
        })
    })
};


exports.deployPatientContract = function (username, abi, bin, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        deployService.deploy(abi, bin, patient[0].account, patient[0].accountPassword, (address) => {
            let contractToInsert = new ContractModel({
                contractName: contractPatientType,
                contractAddress: address,
                contractOwner: patient[0].account
            });
            patientDao.saveContract(contractToInsert, callback);
        })
    })
};


exports.registerUpdateContract = function (abi, username, ssn, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                var md5sum = crypto.createHash('md5');
                var mystr = md5sum.update(username + ssn).digest('hex');
                ethPatientDao.registerPatientInContract(patient[0].account,
                    patient[0].accountPassword,
                    contractAddress,
                    contract,
                    mystr,
                    callback);
            });
        });
    });
};


exports.getPatientData = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getPatientDataFromContract(patient[0].account, patient[0].accountPassword, contract, (patient) => {
                    callback(patient);
                })
            });
        });
    })
};

//doctor contract address = doctor account
exports.addDoctorToPatientMap = function (abi, username, doctorContractAddress, status, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                let response = ethPatientDao.addDoctorToPatientMap(patient[0].account,
                    patient[0].accountPassword,
                    doctorContractAddress,
                    status,
                    contractAddress,
                    contract, (response) => {
                        if (response) {
                            callback(response);
                        }
                    });
            })
        })
    })
};

exports.addOrganToPatientMap = function (abi, patientUsername, docUsername, organ, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                    patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                        loadService.loadContract(abi, contractAddress, (contract) => {
                            ethPatientDao.addOrganToMap(doctor[0].account,
                                doctor[0].accountPassword,
                                organ,
                                contractAddress,
                                contract,
                                (res) => {
                                    callback(res);
                                }
                            )
                        })
                    })
                }
            )
        })
    })
};

exports.getOrganAddressByName = function (abi, username, organ, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getOrganAddressByName(patient[0].account,
                    patient[0].accountPassword,
                    contract,
                    organ,
                    (res) => {
                        callback(res);
                    })
            })
        })
    })
};

exports.getPatientByAccount = function (account) {
    return new Promise(resolve => patientDao.getPatientByAccount(account, (p) =>
        resolve(p))
    );
};


exports.getPatientFromContractByUsername = function (patientAbi, username) {
    return new Promise(resolve => exports.getPatientData(patientAbi, username, (p) =>
        resolve(p))
    );
};

exports.addFileHash = function (abi, username, hash, name, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.addFileHash(patient[0].account,
                    patient[0].accountPassword,
                    hash,
                    name,
                    contractAddress,
                    contract,
                    (response) => {
                        callback(response)
                    })
            })
        })
    })
};

exports.getDocuments = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getDocuments(patient[0].account,
                    patient[0].accountPassword,
                    contract,
                    (response) => {
                        callback(response)
                    })
            })
        })
    })
};

exports.markPatientAsDonor = function (abi, docUsername, patientUsername, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                    loadService.loadContract(abi, contractAddress, (contract) => {
                        ethPatientDao.markPatientAsDonor(doctor[0].account,
                            doctor[0].accountPassword,
                            contractAddress,
                            contract,
                            (response) => {
                                callback(response)
                            })
                    })
                })
            })

        })
    })
};

exports.markPatientAsReceiver = function (abi, docUsername, patientUsername, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                    loadService.loadContract(abi, contractAddress, (contract) => {
                        ethPatientDao.markPatientAsReceiver(doctor[0].account,
                            doctor[0].accountPassword,
                            contractAddress,
                            contract,
                            (response) => {
                                callback(response)
                            })
                    })
                })
            })

        })
    })
};

exports.createRequest = function (abi, docAbi, docUsername, patientUsername, fileHash, fileName, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            loadService.loadContract(docAbi, docContractAddress, (docContract) => {
                patientDao.getPatientByUsername(patientUsername, (patient) => {
                    patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                        loadService.loadContract(abi, contractAddress, (contract) => {
                            var mykey = crypto.createCipher('aes-128-cbc', 'something-secret');
                            var mapKey = mykey.update(docContractAddress + fileHash + new Date(), 'utf8', 'hex')
                            mapKey += mykey.final('hex');

                            ethPatientDao.createRequest(doctor[0].account,
                                doctor[0].accountPassword,
                                contractAddress,
                                contract,
                                mapKey,
                                docContractAddress,
                                fileHash,
                                fileName,
                                (response) => {
                                    ethDoctorDao.createRequest(
                                        doctor[0].account,
                                        doctor[0].accountPassword,
                                        docContractAddress,
                                        docContract,
                                        mapKey,
                                        fileHash,
                                        fileName,
                                        (result) => callback(result)
                                    )
                                })
                        })
                    })
                })
            })
        })
    })
};

exports.approveRequest = function (abi, docAbi, docUsername, patientUsername, fileHash, mapKey, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            loadService.loadContract(docAbi, docContractAddress, (docContract) => {
                patientDao.getPatientByUsername(patientUsername, (patient) => {
                    patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                        loadService.loadContract(abi, contractAddress, (contract) => {
                            ethPatientDao.approveRequest(patient[0].account,
                                patient[0].accountPassword,
                                contractAddress,
                                contract,
                                docContractAddress,
                                mapKey,
                                (response) => {
                                    ethDoctorDao.approveRequest(
                                        patient[0].account,
                                        patient[0].accountPassword,
                                        docContractAddress,
                                        docContract,
                                        mapKey,
                                        (result) => callback(result)
                                    )
                                })
                        })
                    })
                })
            })
        })
    })
};

exports.getRequests = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getRequests(patient[0].account,
                    patient[0].accountPassword,
                    contract,
                    (response) => {
                        callback(response)
                    })
            })
        })
    })
};

exports.setTrustedPerson = function (abi, username, personUsername, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            patientDao.getPatientByUsername(personUsername, (trusted) => {
                loadService.loadContract(abi, contractAddress, (contract) => {
                    ethPatientDao.setTrustedPerson(patient[0].account,
                        patient[0].accountPassword,
                        contract,
                        contractAddress,
                        trusted[0].account,
                        (response) => {
                            callback(response)
                        })
                })
            })
        })
    })
};
